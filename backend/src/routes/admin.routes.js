const router = require("express").Router();
const { z } = require("zod");

const prisma = require("../prisma");
const { requireAuth } = require("../middleware/auth");
const { detectItemType } = require("../utils/detectType");
const cache = require("../utils/cache");

function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ ok: false, message: "Forbidden" });
  }
  next();
}

router.use(requireAuth, requireAdmin);

// ── Categories ──────────────────────────────────────────────────────────────
const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  iconKey: z.string().optional().nullable(),
  iconColor: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

router.post("/categories", async (req, res, next) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(422).json({ ok: false, errors: parsed.error.flatten() });

  try {
    const created = await prisma.category.create({ data: parsed.data });
    cache.invalidate("public:categories");
    res.json({ ok: true, data: created });
  } catch (err) {
    console.error("[ERROR] Create category failed:", err.message);
    next(err);
  }
});

router.put("/categories/:id", async (req, res, next) => {
  const { id } = req.params;
  const parsed = categorySchema.partial().safeParse(req.body);
  if (!parsed.success)
    return res.status(422).json({ ok: false, errors: parsed.error.flatten() });

  try {
    const updated = await prisma.category.update({
      where: { id },
      data: parsed.data,
    });
    cache.invalidate("public:categories");
    res.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[ERROR] Update category failed:", err.message);
    next(err);
  }
});

router.delete("/categories/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({ where: { id } });
    cache.invalidate("public:categories");
    res.json({ ok: true });
  } catch (err) {
    console.error("[ERROR] Delete category failed:", err.message);
    next(err);
  }
});

// ── Items ───────────────────────────────────────────────────────────────────
// Helper for flexible URL validation
const isValidUrl = (val) => {
  try {
    const u = new URL(val);
    return ["http:", "https:"].includes(u.protocol);
  } catch {
    return false;
  }
};

const itemSchema = z.object({
  categoryId: z.string().min(1),
  type: z.enum(["YOUTUBE", "DRIVE", "ONEDRIVE", "OTHER"]).optional(),
  title: z.string().min(2),
  url: z.string().refine(isValidUrl, { message: "URL inválida" }),
  description: z.string().optional().nullable(),
  iconKey: z.string().optional().nullable(),
  iconColor: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

router.post("/items", async (req, res, next) => {
  const parsed = itemSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(422).json({ ok: false, errors: parsed.error.flatten() });

  const data = parsed.data;
  if (!data.type) {
    data.type = detectItemType(data.url);
  }

  try {
    const created = await prisma.item.create({ data });
    res.json({ ok: true, data: created });
  } catch (err) {
    console.error("[ERROR] Create item failed:", err.message);
    next(err);
  }
});

router.put("/items/:id", async (req, res, next) => {
  const { id } = req.params;
  const parsed = itemSchema.partial().safeParse(req.body);
  if (!parsed.success)
    return res.status(422).json({ ok: false, errors: parsed.error.flatten() });

  try {
    const updated = await prisma.item.update({
      where: { id },
      data: parsed.data,
    });
    res.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[ERROR] Update item failed:", err.message);
    next(err);
  }
});

router.delete("/items/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.item.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    console.error("[ERROR] Delete item failed:", err.message);
    next(err);
  }
});

// ── Hero Carousel ───────────────────────────────────────────────────────────
const heroSlideSchema = z.object({
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  imageUrl: z.string().min(1, "La imagen es obligatoria"),
  linkUrl: z.string().optional().nullable(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

router.post("/hero", async (req, res, next) => {
  const parsed = heroSlideSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(422).json({ ok: false, errors: parsed.error.flatten() });

  try {
    const created = await prisma.heroslide.create({ data: parsed.data });
    res.json({ ok: true, data: created });
  } catch (err) {
    console.error("[ERROR] Create hero slide failed:", err.message);
    next(err);
  }
});

router.put("/hero/:id", async (req, res, next) => {
  const { id } = req.params;
  const parsed = heroSlideSchema.partial().safeParse(req.body);
  if (!parsed.success)
    return res.status(422).json({ ok: false, errors: parsed.error.flatten() });

  try {
    const updated = await prisma.heroslide.update({
      where: { id },
      data: parsed.data,
    });
    res.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[ERROR] Update hero slide failed:", err.message);
    next(err);
  }
});

router.delete("/hero/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.heroslide.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    console.error("[ERROR] Delete hero slide failed:", err.message);
    next(err);
  }
});

module.exports = router;
