require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// ── Env validation ─────────────────────────────────────────────────────────
// PORT is intentionally excluded — it is optional (defaults to 4000).
const REQUIRED_VARS = ["DATABASE_URL", "JWT_SECRET"];
const missing = REQUIRED_VARS.filter((v) => !process.env[v]);
if (missing.length) {
  console.warn(
    `[CONFIG] Warning: missing environment variable(s): ${missing.join(", ")}. Some features may not work.`
  );
}

const publicRoutes = require("./routes/public.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const healthRoutes = require("./routes/health.routes");
const ministryRoutes = require("./routes/ministry.routes");
const ministryAdminRoutes = require("./routes/ministry-admin.routes");
const { errorHandler } = require("./middleware/errorHandler");
const prisma = require("./prisma");

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────
const corsOptions = {
  origin: [
    "https://mcp2026.org",
    "https://www.mcp2026.org",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// cors() responde automáticamente a las preflight OPTIONS cuando se define 'methods'
// No usar app.options("*", ...) ya que rompe path-to-regexp en Express 5+
app.use(cors(corsOptions));
app.use(express.json());

// ── BigInt safety net: catch any BigInt that slips through to res.json ──────
// This protects all routes if a Prisma BigInt field is serialized accidentally.
app.set("json replacer", (key, value) =>
  typeof value === "bigint" ? Number(value) : value
);

// ── Static files ───────────────────────────────────────────────────────────
// Serves everything under public/uploads/ at /uploads/*
// This covers both old /uploads/<img> (images now in /uploads/images/)
// and new /uploads/resources/<kind>/<file>
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// ── Routes ─────────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ ok: true, name: "repomovil-api" }));
app.use("/health", healthRoutes);
app.use("/api", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/ministries", ministryAdminRoutes);
app.use("/api/ministries", ministryRoutes);
app.use("/api/upload", require("./routes/upload.routes"));

// ── Global error handler (must be LAST) ────────────────────────────────────
app.use(errorHandler);

// ── Startup ────────────────────────────────────────────────────────────────
const port = Number(process.env.PORT || 4000);

async function start() {
  const server = app.listen(port, () => {
    console.log(`[API] Server running on port ${port}`);
  });

  // Verify DB connectivity — warn but do NOT crash if unavailable
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("[DB] Connected to MariaDB");
  } catch (err) {
    console.warn("[DB] Warning: could not connect to database:", err.message);
    console.warn(
      "[DB] The server is running, but DB routes may fail until the database is available."
    );
  }

  // ── Graceful shutdown ────────────────────────────────────────────────────
  async function shutdown(signal) {
    console.log(`\n[API] ${signal} received — shutting down gracefully...`);
    server.close(async () => {
      try {
        await prisma.$disconnect();
        console.log("[DB] Disconnected from MariaDB");
      } catch (err) {
        console.error("[DB] Error during disconnect:", err.message);
      }
      process.exit(0);
    });

    // Force exit after 10s if server is stuck
    setTimeout(() => {
      console.error("[API] Forced shutdown after timeout");
      process.exit(1);
    }, 10_000).unref();
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start();
