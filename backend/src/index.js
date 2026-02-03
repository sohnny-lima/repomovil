require("dotenv").config();
const express = require("express");
const cors = require("cors");

const publicRoutes = require("./routes/public.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// ✅ CORS (por ahora abierto, luego lo cerramos si quieres)
app.use(cors());
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

// ✅ IMPORTANTE: escuchar en 0.0.0.0 para que sea accesible desde tu celular por LAN
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ API running:`);
  console.log(`   - Local: http://localhost:${port}`);
  console.log(`   - LAN:   http://192.168.100.10:${port}`);
});
