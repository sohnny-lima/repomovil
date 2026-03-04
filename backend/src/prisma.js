require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

// ── Env guard ──────────────────────────────────────────────────────────────
if (!process.env.DATABASE_URL) {
  throw new Error(
    "[CONFIG] DATABASE_URL is not set. Check your .env file before starting."
  );
}

// ── Build adapter from DATABASE_URL ────────────────────────────────────────
// Parsear DATABASE_URL para pasar credenciales explícitas al adaptador
// Esto evita el bug donde el adaptador ignora las credenciales del pool
const u = new URL(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
  host: u.hostname,
  port: u.port ? Number(u.port) : 3306,
  user: decodeURIComponent(u.username),
  password: decodeURIComponent(u.password),
  database: u.pathname.replace(/^\//, ""),
});

// ── Singleton pattern ──────────────────────────────────────────────────────
// In development (nodemon restarts), globalThis persists across hot-reloads,
// so we reuse the same instance instead of creating a new connection pool.
const globalForPrisma = globalThis;

if (!globalForPrisma.__prisma) {
  globalForPrisma.__prisma = new PrismaClient({ adapter });
}

const prisma = globalForPrisma.__prisma;

module.exports = prisma;
