import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },

  datasource: {
    url: process.env.DATABASE_URL,
    // Shadow solo cuando exista la env var (migraciones)
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
