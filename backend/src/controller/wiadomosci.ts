import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { checkIfLogged } from "../database.js";

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
      if ((await checkIfLogged(request.headers.authorization!)) == null) {
        return reply.code(401).send();
      }

      reply.send({
        wiadomosci: [
          {
            id: 0,
            nadawca: "Wladylaw Bomczyk",
            temat: "Big T",
            zalacznik: null,
            otrzymano: "15.02.2024 08:52:10",
            skrzynka: "Adam Mickiewicz",
            przeczytano: false,
          },
        ],
      });
    }
  );

  // GET /api/v1/wiadomosci/lista_adresatow
  fastify.get(
    "/lista_adresatow",
    async function (request: FastifyRequest, reply: FastifyReply) {
      if ((await checkIfLogged(request.headers.authorization!)) == null) {
        return reply.code(401).send();
      }

      reply.send({
        adresaci: [
          ["Wladylaw Bomczyk", 1],
          ["Jan Góra", 2],
        ],
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
      if(await checkIfLogged(request.headers.authorization!) == null) {
        return reply.code(401).send();
      }

      reply.send({
        wiadomosci: [
          {
            id: 0,
            nadawca: "Wladylaw Bomczyk",
            temat: "Big T",
            zalacznik: null,
            otrzymano: "15.02.2024 08:52:10",
            skrzynka: "Adam Mickiewicz",
            tresc: "uwaga, big T na rejonie",
          },
        ],
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
          tresc: string;
        };
      }>,
      reply: FastifyReply
    ) {
      if(await checkIfLogged(request.headers.authorization!) == null) {
        return reply.code(401).send();
      }
      
      reply.send();
    }
  );
}
