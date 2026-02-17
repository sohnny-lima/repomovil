const router = require("express").Router();
const bcrypt = require("bcrypt");
const { z } = require("zod");

const prisma = require("../prisma");
const { signToken } = require("../utils/jwt");

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ ok: false, message: "Datos inválidos" });
  }

  const { email, password } = parsed.data;

  const admin = await prisma.adminuser.findUnique({ where: { email } });
  if (!admin)
    return res
      .status(401)
      .json({ ok: false, message: "Credenciales incorrectas" });

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok)
    return res
      .status(401)
      .json({ ok: false, message: "Credenciales incorrectas" });

  const token = signToken({
    sub: admin.id,
    role: admin.role,
    email: admin.email,
  });

  return res.json({
    ok: true,
    token,
    user: { id: admin.id, email: admin.email, role: admin.role },
  });
});

module.exports = router;
