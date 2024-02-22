import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default async function wiadomosciController(fastify: FastifyInstance) {
  // GET /api/v1/wiadomosci
  fastify.get(
    "/",
    async function (_request: FastifyRequest, reply: FastifyReply) {
      reply.send({
        "wiadomosci": [
            {
                "id": 0,
                "nadawca": "Wladylaw Bomczyk",
                "temat": "Big T",
                "zalacznik": null,
                "otrzymano": "15.02.2024 08:52:10",
                "skrzynka": "Adam Mickiewicz",
                "przeczytano": false
            }
        ]
      });
    }
  );

  // GET /api/v1/wiadomosci/lista_adresatow
  fastify.get(
    "/lista_adresatow",
    async function (_request: FastifyRequest, reply: FastifyReply) {
      reply.send({
        "adresaci": [
            "Wladylaw Bomczyk",
            "Jan Góra"
        ]
      });
    }
  );

  // GET /api/v1/wiadomosci/:id
  fastify.get(
    "/:id",
    async function (_request: FastifyRequest<{
        Params: {
          id: number
        }
      }>, reply: FastifyReply) {
      reply.send({
        "wiadomosci": [
            {
                "id": 0,
                "nadawca": "Wladylaw Bomczyk",
                "temat": "Big T",
                "zalacznik": null,
                "otrzymano": "15.02.2024 08:52:10",
                "skrzynka": "Adam Mickiewicz",
                "tresc": "uwaga, big T na rejonie"
            }
        ]
      });
    }
  );

  // POST /api/v1/wiadomosci/wyslij
  fastify.post(
    "/wyslij",
    async function (_request: FastifyRequest<{
        Body: {
            nadawca: string,
            tresc: string
        }
    }>, reply: FastifyReply) {
      reply.send();
    }
  );
}
