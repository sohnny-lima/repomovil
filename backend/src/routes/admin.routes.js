const router = require("express").Router();
const { z } = require("zod");

const prisma = require("../prisma");
const { requireAuth } = require("../middleware/auth");

// ✅ Importa el detector de tipo
const { detectItemType } = require("../utils/detectType");

function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ ok: false, message: "Forbidden" });
  }
  next();
}

router.use(requireAuth, requireAdmin);

// --- Categories ---
const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

router.post("/categories", async (req, res) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(422).json({ ok: false, errors: parsed.error.flatten() });

  const created = await prisma.category.create({ data: parsed.data });
  res.json({ ok: true, data: created });
});

router.put("/categories/:id", async (req, res) => {
  const { id } = req.params;
  const parsed = categorySchema.partial().safeParse(req.body);
  if (!parsed.success)
    return res.status(422).json({ ok: false, errors: parsed.error.flatten() });

  const updated = await prisma.category.update({
    where: { id },
    data: parsed.data,
  });
  res.json({ ok: true, data: updated });
});

router.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.category.delete({ where: { id } });
  res.json({ ok: true });
});

// --- Items ---
const itemSchema = z.object({
  categoryId: z.string().min(1),
  // ✅ type opcional
  type: z.enum(["YOUTUBE", "DRIVE", "ONEDRIVE", "OTHER"]).optional(),
  title: z.string().min(2),
  url: z.string().url(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

router.post("/items", async (req, res) => {
  const parsed = itemSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(422).json({ ok: false, errors: parsed.error.flatten() });

  const data = parsed.data;

  // ✅ si no mandan type, lo detectamos por URL
  if (!data.type) {
    data.type = detectItemType(data.url);
  }

  const created = await prisma.item.create({ data });
  res.json({ ok: true, data: created });
});

router.put("/items/:id", async (req, res) => {
  const { id } = req.params;
  const parsed = itemSchema.partial().safeParse(req.body);
  if (!parsed.success)
    return res.status(422).json({ ok: false, errors: parsed.error.flatten() });

  const updated = await prisma.item.update({
    where: { id },
    data: parsed.data,
  });
  res.json({ ok: true, data: updated });
});

router.delete("/items/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.item.delete({ where: { id } });
  res.json({ ok: true });
});

module.exports = router;
