import app from "./app.js";

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 3006;

app.listen({ port: FASTIFY_PORT });

console.log(`🚀  Fastify server running on port http://localhost:${FASTIFY_PORT}`);
console.log(`Route index: /`);
console.log(`Route login: /api/v1/login`);
console.log(`Route lekcje: /api/v1/lekcje`);
console.log(`Route wiadomosci: /api/v1/wiadomosci`);
