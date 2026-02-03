const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../../public/uploads");
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-random.ext
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "hero-" + uniqueSuffix + ext);
  },
});

// File filter (images only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes"), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST /api/upload
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, message: "No se subió ningún archivo" });
  }

  // Detect IP for LAN access (optional, usually handled by reverse proxy or just relative path)
  // For simplicity, we return the relative path. Frontend should prepend API URL if needed, 
  // but since we serve static files, we can return the path directly.
  
  // Assuming backend serves 'public' at root or similar. 
  // If we serve 'backend/public/uploads' at 'http://host:port/uploads/filename'
  
  const fileUrl = `/uploads/${req.file.filename}`;
  
  res.json({ 
    ok: true, 
    url: fileUrl,
    filename: req.file.filename
  });
});

module.exports = router;
