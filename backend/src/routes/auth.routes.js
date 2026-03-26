const router = require("express").Router();
const bcrypt = require("bcryptjs");

const prisma = require("../prisma");
const { signToken } = require("../utils/jwt");
const { validateRequest } = require("../middleware/validateRequest");
const { loginSchema } = require("../schemas/auth.schemas");

router.post("/login", validateRequest(loginSchema), async (req, res, next) => {
  const { email, password } = req.validated.body;

  try {
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
  } catch (err) {
    console.error("[ERROR] Login failed:", err.message);
    next(err);
  }
});

module.exports = router;
