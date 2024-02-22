import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { checkIfLogged } from "../database.js";

export default async function lekcjeController(fastify: FastifyInstance) {
  // GET /api/v1/widok/glowny
  fastify.get(
    "/glowny",
    async function (request: FastifyRequest, reply: FastifyReply) {
      if ((await checkIfLogged(request.headers.authorization!)) == null) {
        return reply.code(401).send();
      }

      reply.send({
        godzina: "12:05",
        data: "16 lutego 2024",
        ilosc_wiadomosci: 16,
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

      reply.send({
        data: "12.02 - 18.02 2024",
        dni: [
          {
            data: "12.02.2024",
            dzien: "poniedziałek",
            lekcje: [
              {
                id: 0,
                grupa: "4 TiP",
                przedmiot: "Praktyka Zawodowa",
                nauczyciel: "Adam Mickiewicz",
              },
            ],
          },
        ],
      });
    }
  );

  // GET /api/v1/widok/dodaj_lekcje
  fastify.get(
    "/dodaj_lekcje",
    async function (request: FastifyRequest, reply: FastifyReply) {
      if ((await checkIfLogged(request.headers.authorization!)) == null) {
        return reply.code(401).send();
      }

      reply.send({
        grupa: "",
        przedmiot: "",
      });
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

      reply.send({
        nauczyciel: "Adam Mickiewicz",
        zastępstwo: false,
        nauczyciel_wspomagajacy: null,
        zastepstwo_nau_wspom: false,
        nauczyciel_wspomagajacy_2: null,
        zastepstwo_nau_wspom_2: false,
        grupa: "4 TiP",
        przedmiot: "Praktyka Zawodowa",
        temat: "ABCD",
        kolejny_nr_tematu: 80,
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

      reply.send({
        okres_klasyfikacyjny: 2,
        grupa_kolumn: "moje",
        pokaz_uczniow: "Wszystkich",
        przedmiot: "Praktyka zawodowa",
        uczniowe: [
          {
            numer: 1,
            imie_nazwisko: "Jan Góra",
            srednia: 5.43,
          },
        ],
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
