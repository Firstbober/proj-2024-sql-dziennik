import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import prisma from "../database.js";

import cryptoRandomString from 'crypto-random-string';

export default async function loginController(fastify: FastifyInstance) {
  // POST /api/v1/login
  fastify.post(
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
        return;
      }

      if (request.body.login.length > 400 || request.body.haslo.length > 400) {
        reply.code(400).send({
          statusCode: 400,
          error: "VERIFICATION",
          message: "Zbyt długi login lub hasło"
        })
        return;
      }

      const user = await prisma.user.findUnique({
        where: {
          login: request.body.login
        }
      });
 
      if(user == null) {
        reply.code(400).send({
          statusCode: 400,
          error: "USER",
          message: "Nie ma takiego użytkownika"
        })
        return;
      }

      if(user.password != request.body.haslo) {
        reply.code(400).send({
          statusCode: 400,
          error: "PASS",
          message: "Złe hasło"
        })
        return;
      }

      const token = cryptoRandomString({length:26, type: 'url-safe'});
      await prisma.session.create({
        data: {
          token: token,
          userId: user.id
        }
      });

      reply.send({
        token: token,
      });
    }
  );
}
