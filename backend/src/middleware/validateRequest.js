const { z } = require("zod");

// Activar mensajes de error de Zod en español (global, aplica a todos los schemas)
z.config(z.locales.es());

/**
 * validateRequest(schema, target?)
 *
 * Factory that returns an Express middleware which validates req[target]
 * against the given Zod schema.
 *
 * @param {import("zod").ZodTypeAny} schema  - Zod schema to validate against.
 * @param {"body"|"params"|"query"} [target="body"] - Part of the request to validate.
 *
 * On failure  → 400 { ok: false, errors: ZodError.flatten() }
 * On success  → attaches req.validated[target] = parsed.data and calls next()
 */
function validateRequest(schema, target = "body") {
  return function (req, res, next) {
    const parsed = schema.safeParse(req[target]);

    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        message: "Datos de entrada inválidos",
        errors: parsed.error.flatten(),
      });
    }

    // Attach parsed/coerced data so handlers don't call safeParse again
    if (!req.validated) req.validated = {};
    req.validated[target] = parsed.data;

    next();
  };
}

module.exports = { validateRequest };
