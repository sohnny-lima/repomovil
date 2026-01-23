const { verifyToken } = require("../utils/jwt");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ ok: false, message: "No autorizado" });
  }

  try {
    req.user = verifyToken(token); // { sub, role, email }
    next();
  } catch {
    return res
      .status(401)
      .json({ ok: false, message: "Token inválido o expirado" });
  }
}

module.exports = { requireAuth };
