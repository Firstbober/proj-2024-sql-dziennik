import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default async function loginController(fastify: FastifyInstance) {
  // POST /api/v1/login
  fastify.get(
    "/",
    async function (
      request: FastifyRequest<{
        Body: {
          login: string;
          haslo: string;
        };
      }>,
      reply: FastifyReply
    ) {
      if (request.body.login == undefined || request.body.haslo == undefined) {
        reply.code(400).send();
      }

      reply.send({
        token: "1234567889",
      });
    }
  );
}
