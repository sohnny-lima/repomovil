const { z } = require("zod");

// ── Login ─────────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email   : z.string().email(),
  password: z.string().min(6),
});

module.exports = { loginSchema };
