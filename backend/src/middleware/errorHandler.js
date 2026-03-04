const { isExpectedDbError } = require("../utils/isExpectedDbError");

/**
 * Global Express error-handling middleware.
 * Must be registered AFTER all routes (4-argument signature required by Express).
 *
 * Status mapping:
 *  - Expected DB errors (connectivity/schema) => 503 Service Unavailable
 *  - Validation errors (status 400/422)       => pass through
 *  - Everything else                          => 500 Internal Server Error
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const isProd = process.env.NODE_ENV === "production";

  // Determine HTTP status
  let status = err.status || err.statusCode || 500;
  let clientMessage;

  if (isExpectedDbError(err)) {
    status = 503;
    clientMessage = isProd ? "Service unavailable" : err.message;
  } else if (status === 400 || status === 422) {
    clientMessage = err.message || "Bad request";
  } else {
    status = 500;
    clientMessage = "Internal server error";
  }

  // Always log server-side (full details)
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message || err);
  if (!isProd) {
    console.error(err.stack);
  }

  res.status(status).json({ error: clientMessage });
}

module.exports = { errorHandler };
