import { FastifyInstance } from "fastify";

import login from "./controller/login";
import lekcje from "./controller/lekcje";
import wiadomosci from "./controller/wiadomosci";

export default async function router(fastify: FastifyInstance) {
  fastify.register(login, { prefix: "/api/v1/login" });
  fastify.register(lekcje, { prefix: "/api/v1/widok" });
  fastify.register(wiadomosci, { prefix: "/api/v1/wiadomosci" });
}
