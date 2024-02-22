import { FastifyInstance } from "fastify";

import login from "./controller/login.js";
import lekcje from "./controller/lekcje.js";
import wiadomosci from "./controller/wiadomosci.js";

export default async function router(fastify: FastifyInstance) {
  fastify.register(login, { prefix: "/api/v1/login" });
  fastify.register(lekcje, { prefix: "/api/v1/widok" });
  fastify.register(wiadomosci, { prefix: "/api/v1/wiadomosci" });
}
