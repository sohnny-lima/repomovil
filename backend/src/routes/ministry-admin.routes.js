const router = require("express").Router();
const prisma = require("../prisma");
const { requireAuth } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validateRequest");
const { resourceSchema } = require("../schemas/ministry.schemas");
const { toPublicUrl } = require("../utils/urlHelper");

/**
 * Prisma returns sizeBytes as BigInt (native JS BigInt).
 * JSON.stringify cannot serialize BigInt natively -> this helper converts it.
 * We use Number() which is safe for file sizes up to ~9 PB.
 */
function serializeResource(r) {
  return {
    ...r,
    sizeBytes: r.sizeBytes !== null && r.sizeBytes !== undefined
      ? Number(r.sizeBytes)
      : null,
    fileUrl: toPublicUrl(r.fileUrl),
  };
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ ok: false, message: "Forbidden" });
  }
  next();
}

router.use(requireAuth, requireAdmin);

// GET /api/admin/ministries — list all ministries
router.get("/", async (req, res, next) => {
  try {
    const ministries = await prisma.ministry.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isDefault: true,
        _count: { select: { resources: true } },
      },
    });
    res.json({ ok: true, data: ministries });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/ministries/:id/resources — list resources of a ministry
router.get("/:id/resources", async (req, res, next) => {
  const { id } = req.params;
  try {
    const ministry = await prisma.ministry.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        resources: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!ministry) return res.status(404).json({ ok: false, message: "Ministry not found" });
    const withSerialized = ministry.resources.map(serializeResource);
    res.json({ ok: true, ministryName: ministry.name, slug: ministry.slug, data: withSerialized });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/ministries/:id/resources — create resource
router.post("/:id/resources", validateRequest(resourceSchema), async (req, res, next) => {
  const { id } = req.params;
  try {
    // Verify ministry exists
    const ministry = await prisma.ministry.findUnique({ where: { id } });
    if (!ministry) return res.status(404).json({ ok: false, message: "Ministry not found" });

    const created = await prisma.ministryresource.create({
      data: { ...req.validated.body, ministryId: id },
    });
    res.json({ ok: true, data: serializeResource(created) });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/ministries/:id/resources/:rid — update resource
router.put("/:id/resources/:rid", validateRequest(resourceSchema.partial()), async (req, res, next) => {
  const { rid } = req.params;
  try {
    const updated = await prisma.ministryresource.update({
      where: { id: rid },
      data: req.validated.body,
    });
    res.json({ ok: true, data: serializeResource(updated) });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/ministries/:id/resources/:rid — delete resource
router.delete("/:id/resources/:rid", async (req, res, next) => {
  const { rid } = req.params;
  try {
    await prisma.ministryresource.delete({ where: { id: rid } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
