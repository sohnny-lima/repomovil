const router = require("express").Router();
const prisma = require("../prisma");

// GET /health
router.get("/", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    console.error("[DB] Health check failed:", err.message);
    res.status(503).json({ status: "error", database: "disconnected" });
  }
});

module.exports = router;
