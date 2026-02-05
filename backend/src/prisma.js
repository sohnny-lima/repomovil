require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

// Parsear DATABASE_URL para pasar credenciales explícitas al adaptador
// Esto evita el bug donde el adaptador ignora las credenciales del pool
const u = new URL(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
  host: u.hostname,
  port: u.port ? Number(u.port) : 3306,
  user: decodeURIComponent(u.username),       // repomovil_user
  password: decodeURIComponent(u.password),   // 123456
  database: u.pathname.replace(/^\//, ""),    // repomovil
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
