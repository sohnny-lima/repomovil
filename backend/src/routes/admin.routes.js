const router = require("express").Router();

const prisma = require("../prisma");
const { requireAuth } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validateRequest");
const { categorySchema, itemSchema, heroSlideSchema } = require("../schemas/admin.schemas");
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

router.post("/categories", validateRequest(categorySchema), async (req, res, next) => {
  try {
    const data = { ...req.validated.body };
    // Auto-assign to Mayordomía if no ministryId provided
    if (!data.ministryId) {
      const mayordomia = await prisma.ministry.findUnique({ where: { slug: "mayordomia" } });
      if (mayordomia) data.ministryId = mayordomia.id;
    }
    const created = await prisma.category.create({ data });
    cache.invalidate("public:categories");
    res.json({ ok: true, data: created });
  } catch (err) {
    console.error("[ERROR] Create category failed:", err.message);
    next(err);
  }
});

router.put("/categories/:id", validateRequest(categorySchema.partial()), async (req, res, next) => {
  const { id } = req.params;
  try {
    const updated = await prisma.category.update({
      where: { id },
      data: req.validated.body,
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

router.post("/items", validateRequest(itemSchema), async (req, res, next) => {
  const data = { ...req.validated.body };
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

router.put("/items/:id", validateRequest(itemSchema.partial()), async (req, res, next) => {
  const { id } = req.params;
  try {
    const updated = await prisma.item.update({
      where: { id },
      data: req.validated.body,
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

router.post("/hero", validateRequest(heroSlideSchema), async (req, res, next) => {
  try {
    const created = await prisma.heroslide.create({ data: req.validated.body });
    res.json({ ok: true, data: created });
  } catch (err) {
    console.error("[ERROR] Create hero slide failed:", err.message);
    next(err);
  }
});

router.put("/hero/:id", validateRequest(heroSlideSchema.partial()), async (req, res, next) => {
  const { id } = req.params;
  try {
    const updated = await prisma.heroslide.update({
      where: { id },
      data: req.validated.body,
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
