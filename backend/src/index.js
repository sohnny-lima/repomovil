require("dotenv").config();
const express = require("express");
const cors = require("cors");

const publicRoutes = require("./routes/public.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// Demo rápido (abierto):
app.use(cors());

// Si quieres cerrar a Vercel, reemplaza por el bloque de allowedOrigins de arriba.

app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true, name: "repomovil-api" }));

// Static files
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.use("/api", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", require("./routes/upload.routes"));

const port = Number(process.env.PORT || 4000);

// ✅ Listen (Render asigna el host automáticamente)
app.listen(port, () => {
  console.log(`✅ API running on port ${port}`);
});
