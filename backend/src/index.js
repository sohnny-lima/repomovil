require("dotenv").config();
const express = require("express");
const cors = require("cors");

const publicRoutes = require("./routes/public.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true, name: "repomovil-api" }));

app.use("/api", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`✅ API running on http://localhost:${port}`),
);
