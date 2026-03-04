/**
 * Detects "expected" database failures that should return a safe fallback
 * (e.g. [] for lists) rather than propagating as a 500/unexpected error.
 *
 * Expected failures:
 *  - Prisma driver-adapter errors (DriverAdapterError)
 *  - Prisma error codes: P1001, P1002 (can't reach DB), P2021 (table not found)
 *  - MySQL/MariaDB connection errors: ECONNREFUSED, ETIMEDOUT, ENOTFOUND
 *  - MySQL SQLSTATE 42S02 (table or view not found)
 *  - MySQL error code 1146 (Table doesn't exist)
 *
 * @param {unknown} err
 * @returns {boolean}
 */
function isExpectedDbError(err) {
  if (!err || typeof err !== "object") return false;

  // Prisma driver-adapter error wrapper
  if (err.constructor?.name === "DriverAdapterError") return true;
  if (err.name === "DriverAdapterError") return true;

  // Prisma P-code errors (Prisma wraps them in PrismaClientKnownRequestError etc.)
  const EXPECTED_PRISMA_CODES = new Set(["P1001", "P1002", "P2021"]);
  if (err.code && EXPECTED_PRISMA_CODES.has(err.code)) return true;

  // Node.js / MySQL connectivity error codes
  const EXPECTED_SYSCALL_CODES = new Set([
    "ECONNREFUSED",
    "ETIMEDOUT",
    "ENOTFOUND",
    "ECONNRESET",
    "EPIPE",
  ]);
  if (err.code && EXPECTED_SYSCALL_CODES.has(err.code)) return true;

  // MySQL SQLSTATE for "table or view not found" (42S02) and errno 1146
  if (err.sqlState === "42S02") return true;
  if (err.errno === 1146) return true;

  // Nested cause (Prisma often wraps the original DriverAdapterError)
  if (err.cause && isExpectedDbError(err.cause)) return true;

  return false;
}

module.exports = { isExpectedDbError };
