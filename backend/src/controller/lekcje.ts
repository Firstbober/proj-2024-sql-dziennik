import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import prisma, { checkIfLogged } from "../database.js";
import { User } from "@prisma/client";
import {
  endOfDay,
  endOfWeek,
  setDefaultOptions,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import { pl } from "date-fns/locale";

export default async function lekcjeController(fastify: FastifyInstance) {
  setDefaultOptions({
    locale: pl,
  });

  // GET /api/v1/widok/glowny
  fastify.get(
    "/glowny",
    async function (request: FastifyRequest, reply: FastifyReply) {
      let user: User | null;
      if (
        (user = await checkIfLogged(request.headers.authorization!)) == null
      ) {
        return reply.code(401).send();
      }

      reply.send({
        godzina: new Date().toLocaleTimeString("pl-PL", {
          second: undefined,
          minute: "2-digit",
          hour: "2-digit",
        }),
        data: new Date().toLocaleDateString("pl-PL", {
          weekday: undefined,
          year: "numeric",
          month: "long",
          day: "2-digit",
        }),
        ilosc_wiadomosci: await prisma.message.count({
          where: {
            to: user,
          },
        }),
        do_zmiany_hasla_zostalo: 23,
        wersja_dziennika: "0.0.0.1 alpha",
      });
    }
  );

  // GET /api/v1/widok/lekcje
  fastify.get(
    "/lekcje",
    async function (request: FastifyRequest, reply: FastifyReply) {
      if ((await checkIfLogged(request.headers.authorization!)) == null) {
        return reply.code(401).send();
      }

      let days = [];
      const db_lessons = await prisma.lesson.findMany({
        where: {
          date: {
            gte: startOfWeek(new Date()),
            lte: subDays(endOfWeek(new Date()), 1),
          },
        },
        orderBy: {
          date: "asc",
        },
      });

      let lastDate = startOfWeek(new Date());
      let lessons = [];
      for (const lesson of db_lessons) {
        if (lastDate.getDay() != lesson.date.getDay()) {
          days.push({
            data: lastDate.toLocaleDateString("pl-PL", {
              weekday: undefined,
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
            dzien: lastDate.toLocaleDateString("pl-PL", {
              weekday: "long",
              year: undefined,
              month: undefined,
              day: undefined,
            }),
            lekcje: lessons,
          });
          lastDate = lesson.date;
        }

        lessons.push({
          id: lesson.id,
          godzina: lesson.hour,
          grupa: lesson.group,
          przedmiot: lesson.subject,
          nauczyciel: (
            await prisma.user.findUnique({
              where: {
                id: lesson.userId,
              },
              select: {
                name: true,
              },
            })
          )?.name,
        });
      }

      reply.send({
        data: `${startOfWeek(new Date()).toLocaleDateString("pl-PL", {
          weekday: undefined,
          year: undefined,
          month: "2-digit",
          day: "2-digit",
        })} - ${subDays(endOfWeek(new Date()), 1).toLocaleDateString("pl-PL", {
          weekday: undefined,
          year: undefined,
          month: "2-digit",
          day: "2-digit",
        })} ${new Date().getFullYear()}`,
        dni: days,
      });
    }
  );

  // POST /api/v1/widok/dodaj_lekcje
  fastify.post(
    "/dodaj_lekcje",
    async function (
      request: FastifyRequest<{
        Body: {
          nauczyciel: string;
          godzina: number;
          grupa: string;
          przedmiot: string;
          temat: string;
        };
      }>,
      reply: FastifyReply
    ) {
      if ((await checkIfLogged(request.headers.authorization!)) == null) {
        return reply.code(401).send();
      }

      if (
        request.body.nauczyciel == undefined ||
        request.body.godzina == undefined ||
        request.body.grupa == undefined ||
        request.body.przedmiot == undefined
      ) {
        return reply.code(400).send();
      }

      const lessonCount = await prisma.lesson.count({
        where: {
          date: {
            gte: startOfDay(new Date()),
            lte: endOfDay(new Date()),
          },
          hour: request.body.godzina,
          teacher: {
            name: request.body.nauczyciel,
          },
        },
      });

      if (lessonCount > 0) {
        return reply.code(409).send();
      }

      const teacher = await prisma.user.findMany({
        where: {
          name: request.body.nauczyciel,
        },
      });

      await prisma.lesson.create({
        data: {
          date: new Date(),
          hour: request.body.godzina,
          group: request.body.grupa,
          subject: request.body.przedmiot,
          teacher: {
            connect: {
              id: teacher[0].id,
            },
          },
        },
      });

      reply.send();
    }
  );

  // GET /api/v1/widok/lekcje/:id/opis
  fastify.get(
    "/lekcje/:id/opis",
    async function (
      request: FastifyRequest<{
        Params: {
          id: number;
        };
      }>,
      reply: FastifyReply
    ) {
      if ((await checkIfLogged(request.headers.authorization!)) == null) {
        return reply.code(401).send();
      }

      if (request.params.id == undefined) {
        return reply.code(400).send();
      }

      const lesson = await prisma.lesson.findUnique({
        where: {
          id: Number(request.params.id),
        },

        select: {
          teacher: true,
          group: true,
          subject: true,
          topic: true,
          id: true,
        },
      });

      if (lesson == null) {
        return reply.code(404).send();
      }

      reply.send({
        nauczyciel: lesson.teacher.name,
        zastępstwo: false,
        nauczyciel_wspomagajacy: null,
        zastepstwo_nau_wspom: false,
        nauczyciel_wspomagajacy_2: null,
        zastepstwo_nau_wspom_2: false,
        grupa: lesson.group,
        przedmiot: lesson.subject,
        temat: lesson.topic,
        kolejny_nr_tematu: lesson.id + 1,
      });
    }
  );

  // GET /api/v1/widok/lekcje/:id/oceny
  fastify.get(
    "/lekcje/:id/oceny",
    async function (
      request: FastifyRequest<{
        Params: {
          id: number;
        };
      }>,
      reply: FastifyReply
    ) {
      if ((await checkIfLogged(request.headers.authorization!)) == null) {
        return reply.code(401).send();
      }

      if (request.params.id == undefined) {
        return reply.code(400).send();
      }

      const lesson = await prisma.lesson.findUnique({
        where: {
          id: Number(request.params.id),
        },

        select: {
          subject: true,
          id: true,
        },
      });

      if (lesson == null) {
        return reply.code(404).send();
      }

      const grades = await prisma.grade.findMany({
        where: {
          lessonId: lesson.id,
        },
        select: {
          student: true,
          grade: true,
        },
      });

      console.log(grades)

      let uczniowie: any = {};

      for (const grade of grades) {
        if (uczniowie[grade.student.id] == undefined) {
          uczniowie[grade.student.id] = {
            id: grade.student.id,
            imie_naziwsko: grade.student.name,
            oceny: [],
            srednia: 0,
          };
        }

        uczniowie[grade.student.id].oceny.push(grade.grade);
      }

      reply.send({
        okres_klasyfikacyjny: 2,
        grupa_kolumn: "moje",
        pokaz_uczniow: "Wszystkich",
        przedmiot: lesson.subject,
        uczniowe: Object.entries(uczniowie).map((va: any) => {
          const v = va[1];
          return {
            id: v.id,
            imie_nazwisko: v.imie_naziwsko,
            oceny: v.oceny,
            srednia:
              v.oceny.reduce((a: number, b: number) => a + b) / v.oceny.length,
          };
        }),
      });
    }
  );

  interface Uczeń {
    nr: number;
    frekwencja: "b" | "o" | "?";
  }

  // GET /api/v1/widok/lekcje/:id/frekwencja
  fastify.get(
    "/lekcje/:id/frekwencja",
    async function (
      request: FastifyRequest<{
        Params: {
          id: number;
        };
      }>,
      reply: FastifyReply
    ) {
      if ((await checkIfLogged(request.headers.authorization!)) == null) {
        return reply.code(401).send();
      }

      reply.send({
        uczniowie: [
          {
            nr: 1,
            imie_nazwisko: "Jan Góra",
            frekwencja: [
              "b",
              "o",
              "o",
              "o",
              "o",
              "o",
              "o",
              "o",
              "o",
              "n",
              "?",
              "b",
              "b",
              "b",
            ],
          },
        ],
        obecnych: [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      });
    }
  );

  // POST /api/v1/widok/lekcje/:id/frekwencja/zmien
  fastify.post(
    "/lekcje/:id/frekwencja/zmien",
    async function (
      request: FastifyRequest<{
        Params: {
          id: number;
        };
        Body: {
          uczniowie: Array<Uczeń>;
        };
      }>,
      reply: FastifyReply
    ) {
      if ((await checkIfLogged(request.headers.authorization!)) == null) {
        return reply.code(401).send();
      }

      reply.send();
    }
  );
}
