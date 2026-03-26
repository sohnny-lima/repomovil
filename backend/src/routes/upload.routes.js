/**
 * upload.routes.js
 *
 * POST /api/upload          — images only (unchanged, 10 MB)
 * POST /api/upload/resource — PDF, PPTX, Word, Audio, Video
 *                             Files are stored in per-kind subdirs under public/uploads/
 */

const router  = require("express").Router();
const multer  = require("multer");
const path    = require("path");
const { requireAuth } = require("../middleware/auth");
const {
  detectKind,
  buildFilename,
  getDestDir,
  ensureDir,
  buildFileUrl,
  buildStoragePath,
  SIZE_LIMITS,
  limitLabel,
} = require("../utils/fileHelper");

// ── MULTER ERROR FORMATTER ─────────────────────────────────────────────────
function handleMulterError(err, res) {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ ok: false, message: err.message });
  }
  if (err.message) {
    return res.status(400).json({ ok: false, message: err.message });
  }
  return res.status(500).json({ ok: false, message: "Error procesando archivo" });
}

// ══════════════════════════════════════════════════════════════════════════
//  1. IMAGE UPLOAD  (POST /api/upload)  — original behaviour, untouched
// ══════════════════════════════════════════════════════════════════════════
const imageStorage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = getDestDir("IMAGE");
    ensureDir(dir);
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, buildFilename(file.originalname));
  },
});

const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Solo se permiten imágenes"), false);
  }
  cb(null, true);
};

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: SIZE_LIMITS.IMAGE },
});

router.post("/", (req, res) => {
  imageUpload.single("file")(req, res, (err) => {
    if (err) return handleMulterError(err, res);
    if (!req.file) return res.status(400).json({ ok: false, message: "No se subió ningún archivo" });

    // Keep same response shape as before for backward compatibility
    const fileUrl = buildFileUrl("IMAGE", req.file.filename);
    res.json({ ok: true, url: fileUrl, filename: req.file.filename });
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  2. RESOURCE UPLOAD  (POST /api/upload/resource)
// ══════════════════════════════════════════════════════════════════════════

/**
 * Dynamic diskStorage: kind is detected in `fileFilter` and stored on `req`,
 * so `destination` can route to the correct subfolder.
 */
const resourceStorage = multer.diskStorage({
  destination(req, file, cb) {
    const kind = req._detectedKind || "OTHER";
    const dir  = getDestDir(kind);
    ensureDir(dir);
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, buildFilename(file.originalname));
  },
});

const resourceFilter = (req, file, cb) => {
  const kind = detectKind(file.mimetype, file.originalname);

  if (!kind) {
    return cb(
      new Error(`Tipo de archivo no permitido. Extensión o MIME no reconocido: ${file.mimetype}`),
      false
    );
  }

  // Reject plain images on the resource endpoint
  if (kind === "IMAGE") {
    return cb(
      new Error("Para imágenes usa /api/upload. Este endpoint acepta: PDF, PPT/PPTX, Word, Audio, Video"),
      false
    );
  }

  // Store kind on request for destination() and the route handler
  req._detectedKind = kind;
  cb(null, true);
};

/**
 * The resource multer instance uses the MAXIMUM possible limit (250 MB).
 * Per-kind enforcement is done AFTER upload in the route handler to give
 * a meaningful error message (multer's LIMIT_FILE_SIZE error loses context).
 */
const resourceUpload = multer({
  storage: resourceStorage,
  fileFilter: resourceFilter,
  limits: { fileSize: 250 * 1024 * 1024 }, // 250 MB hard cap
});

// POST /api/upload/resource  — requires authentication (admin only)
router.post("/resource", requireAuth, (req, res) => {
  resourceUpload.single("file")(req, res, (err) => {
    if (err) return handleMulterError(err, res);
    if (!req.file) return res.status(400).json({ ok: false, message: "No se subió ningún archivo" });

    const kind      = req._detectedKind || "OTHER";
    const kindLimit = SIZE_LIMITS[kind];

    // Per-kind size enforcement (post-upload)
    if (kindLimit && req.file.size > kindLimit) {
      // Async cleanup of the oversized file
      require("fs").unlink(req.file.path, () => {});
      return res.status(413).json({
        ok: false,
        message: `El archivo excede el límite permitido para ${kind}: ${limitLabel(kind)}`,
      });
    }

    const ext         = path.extname(req.file.originalname).toLowerCase();
    const fileUrl     = buildFileUrl(kind, req.file.filename);
    // buildStoragePath returns a portable relative path (no absolute disk paths exposed)
    const storagePath = buildStoragePath(kind, req.file.filename);

    res.json({
      ok: true,
      file: {
        url         : fileUrl,
        storagePath,                              // relative: "uploads/resources/ppt/file.pptx"
        originalName: req.file.originalname,
        filename    : req.file.filename,
        mimeType    : req.file.mimetype,
        extension   : ext,
        sizeBytes   : Number(req.file.size),      // safe up to ~9 PB; no BigInt serialization issue
        kind,
      },
    });
  });
});

module.exports = router;
