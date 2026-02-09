import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Lee SHADOW de forma opcional (NO revienta si no existe)
// @ts-ignore - process está disponible en Node.js
const shadow = process.env.SHADOW_DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },

  datasource: {
    url: env("DATABASE_URL"),
  },

  // @ts-expect-error - 'migrate' es soportado por Prisma CLI 7+ pero falta en algunas definiciones de tipos
  migrate: {
    url: env("DATABASE_URL"),
    // Solo configura shadow si existe (en prod no es necesario)
    ...(shadow ? { shadowDatabaseUrl: shadow } : {}),
  },
});
