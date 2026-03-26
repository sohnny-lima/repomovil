/**
 * fileHelper.js
 * Utilidades reutilizables para el sistema de upload de archivos.
 * Centraliza validación, detección de tipo, sanitización y routing de carpetas.
 */

const path = require("path");
const fs   = require("fs");

// ── Limits per kind (bytes) ────────────────────────────────────────────────
const SIZE_LIMITS = {
  IMAGE : 10  * 1024 * 1024,   // 10 MB
  PDF   : 25  * 1024 * 1024,   // 25 MB
  PPTX  : 250 * 1024 * 1024,   // 250 MB
  WORD  : 50  * 1024 * 1024,   // 50 MB
  AUDIO : 50  * 1024 * 1024,   // 50 MB
  VIDEO : 250 * 1024 * 1024,   // 250 MB
  OTHER : 25  * 1024 * 1024,   // 25 MB
};

// ── Subdir per kind  ──────────────────────────────────────────────────────
const KIND_TO_SUBDIR = {
  IMAGE : "images",
  PDF   : "resources/pdf",
  PPTX  : "resources/ppt",
  WORD  : "resources/word",
  AUDIO : "resources/audio",
  VIDEO : "resources/video",
  OTHER : "resources/other",
};

// ── Allowed MIME types ────────────────────────────────────────────────────
const MIME_TO_KIND = {
  // Images
  "image/jpeg"     : "IMAGE",
  "image/jpg"      : "IMAGE",
  "image/png"      : "IMAGE",
  "image/webp"     : "IMAGE",
  "image/gif"      : "IMAGE",
  "image/svg+xml"  : "IMAGE",

  // PDF
  "application/pdf": "PDF",

  // PPT / PPTX
  "application/vnd.ms-powerpoint"                                                       : "PPTX",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"          : "PPTX",

  // Word / DOCX
  "application/msword"                                                                  : "WORD",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"            : "WORD",

  // Audio
  "audio/mpeg"     : "AUDIO",
  "audio/mp3"      : "AUDIO",
  "audio/wav"      : "AUDIO",
  "audio/x-wav"    : "AUDIO",
  "audio/m4a"      : "AUDIO",
  "audio/x-m4a"    : "AUDIO",
  "audio/mp4"      : "AUDIO",
  "audio/ogg"      : "AUDIO",

  // Video
  "video/mp4"      : "VIDEO",
  "video/quicktime": "VIDEO",
  "video/x-msvideo": "VIDEO",
  "video/webm"     : "VIDEO",
  "video/ogg"      : "VIDEO",
};

// ── Allowed extensions (fallback when MIME is wrong/missing) ───────────────
const EXT_TO_KIND = {
  ".jpg"  : "IMAGE", ".jpeg": "IMAGE", ".png": "IMAGE", ".webp": "IMAGE",
  ".pdf"  : "PDF",
  ".ppt"  : "PPTX",  ".pptx": "PPTX",
  ".doc"  : "WORD",  ".docx": "WORD",
  ".mp3"  : "AUDIO", ".wav" : "AUDIO", ".m4a": "AUDIO",
  ".mp4"  : "VIDEO", ".mov" : "VIDEO", ".avi": "VIDEO", ".webm": "VIDEO",
};

/**
 * Detect the kind (IMAGE | PDF | PPTX | WORD | AUDIO | VIDEO | null)
 * from both MIME type and file extension.
 *
 * Rules:
 * - If extension is executable/dangerous → always null (block)
 * - If both MIME and ext known → they must agree
 * - If only one is known  → use it (accommodates browsers that misreport MIME)
 */
const DANGEROUS_EXTS = new Set([
  ".exe", ".bat", ".cmd", ".sh", ".ps1", ".php", ".py",
  ".js", ".ts", ".jar", ".vbs", ".com", ".msi", ".dll",
  ".html", ".htm", ".svg",   // HTML/SVG can carry XSS
]);

function detectKind(mimeType, originalName) {
  const ext  = path.extname(originalName || "").toLowerCase();

  // Hard block on dangerous extensions regardless of MIME
  if (DANGEROUS_EXTS.has(ext)) return null;

  const fromMime = MIME_TO_KIND[mimeType];
  const fromExt  = EXT_TO_KIND[ext];

  if (!fromMime && !fromExt) return null;             // completely unknown
  if (fromMime && fromExt && fromMime !== fromExt) return null; // mismatch – suspicious
  return fromMime || fromExt;
}

/**
 * Sanitize a filename: keep only safe characters, collapse spaces, trim.
 * Does NOT include path separators or dangerous chars.
 */
function sanitizeFilename(name) {
  return name
    .replace(/[^a-zA-Z0-9._\-\u00C0-\u017E ]/g, "")   // keep latin extended
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .toLowerCase()
    .slice(0, 80); // hard cap
}

/**
 * Build a unique, safe storage filename.
 * Format: <timestamp>-<random>-<sanitized-original>.ext
 */
function buildFilename(originalName) {
  const ext   = path.extname(originalName).toLowerCase();
  const base  = path.basename(originalName, ext);
  const slug  = sanitizeFilename(base);
  const ts    = Date.now();
  const rand  = Math.random().toString(36).slice(2, 8);
  return `${ts}-${rand}-${slug}${ext}`;
}

/**
 * Absolute destination directory on disk for the given kind.
 */
function getDestDir(kind) {
  const subdir = KIND_TO_SUBDIR[kind] || KIND_TO_SUBDIR.OTHER;
  return path.join(__dirname, "../../public/uploads", subdir);
}

/**
 * Ensure a directory exists (recursive mkdir).
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/**
 * Portable relative storage path (no absolute disk paths).
 * Safe to store in DB and to include in API responses.
 * Example: "uploads/resources/ppt/filename.pptx"
 */
function buildStoragePath(kind, filename) {
  const subdir = KIND_TO_SUBDIR[kind] || KIND_TO_SUBDIR.OTHER;
  // Always use forward slashes (portable across Windows/Linux)
  return `uploads/${subdir}/${filename}`;
}

/**
 * Relative URL path for a stored file.
 * E.g. /uploads/resources/pdf/filename.pdf
 */
function buildFileUrl(kind, filename) {
  const subdir = KIND_TO_SUBDIR[kind] || KIND_TO_SUBDIR.OTHER;
  return `/uploads/${subdir}/${filename}`;
}

/**
 * Human-readable size limit label for a given kind.
 */
function limitLabel(kind) {
  const bytes = SIZE_LIMITS[kind] || SIZE_LIMITS.OTHER;
  const mb = Math.round(bytes / (1024 * 1024));
  return `${mb} MB`;
}

module.exports = {
  SIZE_LIMITS,
  KIND_TO_SUBDIR,
  DANGEROUS_EXTS,
  detectKind,
  sanitizeFilename,
  buildFilename,
  getDestDir,
  ensureDir,
  buildFileUrl,
  buildStoragePath,
  limitLabel,
};
