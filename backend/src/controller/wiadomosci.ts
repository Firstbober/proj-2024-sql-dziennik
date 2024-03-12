import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import prisma, { checkIfLogged } from "../database.js";
import { User } from "@prisma/client";

export default async function wiadomosciController(fastify: FastifyInstance) {
  // GET /api/v1/wiadomosci
  fastify.get(
    "/",
    async function (
      request: FastifyRequest<{
        Headers: {
          Authorization: string;
        };
      }>,
      reply: FastifyReply
    ) {
      let user: User | null;
      if (
        (user = await checkIfLogged(request.headers.authorization!)) == null
      ) {
        return reply.code(401).send();
      }

      if ((await checkIfLogged(request.headers.authorization!)) == null) {
        return reply.code(401).send();
      }

      const messages = await prisma.message.findMany({
        where: {
          to_userId: user.id
        },
        select: {
          id: true,
          from: true,
          topic: true,
          time: true
        }
      })

      reply.send({
        wiadomosci: messages.map((v) => {
          return {
            id: v.id,
            nadawca: v.from.name,
            temat: v.topic,
            zalacznik: null,
            otrzymano: v.time,
            skrzynka: user?.name,
            przeczytano: false,
          }
        })
      });
    }
  );

  // GET /api/v1/wiadomosci/lista_adresatow
  fastify.get(
    "/lista_adresatow",
    async function (request: FastifyRequest, reply: FastifyReply) {
      let user: User | null;
      if (
        (user = await checkIfLogged(request.headers.authorization!)) == null
      ) {
        return reply.code(401).send();
      }

      const users = await prisma.user.findMany({
        where: {
          NOT: {
            id: user.id
          }
        }
      });

      reply.send({
        adresaci: users.map((v) => {
          return [v.name, v.id]
        })
      });
    }
  );

  // GET /api/v1/wiadomosci/:id
  fastify.get(
    "/:id",
    async function (
      request: FastifyRequest<{
        Params: {
          id: number;
        };
      }>,
      reply: FastifyReply
    ) {
      let user: User | null;
      if (
        (user = await checkIfLogged(request.headers.authorization!)) == null
      ) {
        return reply.code(401).send();
      }

      const message = await prisma.message.findUnique({
        where: {
          id: request.params.id
        },
        select: {
          id: true,
          from: true,
          topic: true,
          time: true,
          content: true
        }
      })

      if(message == null) {
        return reply.code(404).send();
      }

      reply.send({
        wiadomosci: {
            id: message.id,
            nadawca: message.from.name,
            temat: message.topic,
            zalacznik: null,
            otrzymano: message.time,
            skrzynka: user?.name,
            tresc: message.content
          }
      });
    }
  );

  // POST /api/v1/wiadomosci/wyslij
  fastify.post(
    "/wyslij",
    async function (
      request: FastifyRequest<{
        Body: {
          odbiorca: number;
          temat: string;
          tresc: string;
        };
      }>,
      reply: FastifyReply
    ) {
      let user: User | null;
      if (
        (user = await checkIfLogged(request.headers.authorization!)) == null
      ) {
        return reply.code(401).send();
      }

      const receiver = await prisma.user.findUnique({
        where: {
          id: request.body.odbiorca
        }
      });

      if(receiver == null) {
        return reply.code(404).send();
      }

      await prisma.message.create({
        data: {
          from_userId: user.id,
          to_userId: Number(request.body.odbiorca),
          content: request.body.tresc,
          topic: request.body.temat,
          time: new Date()
        }
      })
      
      reply.send();
    }
  );
}
