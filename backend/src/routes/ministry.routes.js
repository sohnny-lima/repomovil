const router = require("express").Router();
const prisma = require("../prisma");
const { toPublicUrl } = require("../utils/urlHelper");
const { isExpectedDbError } = require("../utils/isExpectedDbError");

// GET /api/ministries — list all ministries
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
    res.json(ministries);
  } catch (err) {
    if (isExpectedDbError(err)) return res.json([]);
    next(err);
  }
});

// GET /api/ministries/:slug — get ministry with resources
router.get("/:slug", async (req, res, next) => {
  const { slug } = req.params;
  try {
    const ministry = await prisma.ministry.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isDefault: true,
        resources: {
          orderBy: { createdAt: "desc" },
          select: {
            id       : true,
            title    : true,
            description: true,
            type     : true,
            fileUrl  : true,
            originalName: true,
            mimeType : true,
            extension: true,
            sizeBytes: true,
            createdAt: true,
          },
        },
        categories: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            description: true,
            iconKey: true,
            iconColor: true,
            imageUrl: true,
            isActive: true,
            createdAt: true,
            ministryId: true,
            item: {
              where: { isActive: true },
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!ministry) {
      return res.status(404).json({
        ok: false,
        message: "Ministerio no encontrado"
      });
    }

    // Resolve file URLs and serialize BigInt sizeBytes → Number
    const ministryWithUrls = {
      ...ministry,
      resources: ministry.resources.map((r) => ({
        ...r,
        fileUrl  : toPublicUrl(r.fileUrl),
        sizeBytes: r.sizeBytes !== null && r.sizeBytes !== undefined
          ? Number(r.sizeBytes)
          : null,
      })),
      categories: ministry.categories.map((c) => {
        const { item, ...rest } = c;
        return {
          ...rest,
          items: item || []
        };
      }),
    };

    res.json(ministryWithUrls);
  } catch (err) {
    if (isExpectedDbError(err)) return res.status(503).json({ error: "DB unavailable" });
    next(err);
  }
});

module.exports = router;
