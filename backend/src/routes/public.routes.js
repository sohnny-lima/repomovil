const router = require("express").Router();
const prisma = require("../prisma");
const { toPublicUrl } = require("../utils/urlHelper");
const cache = require("../utils/cache");
const { isExpectedDbError } = require("../utils/isExpectedDbError");

const CATEGORIES_CACHE_KEY = "public:categories";
const CATEGORIES_TTL = 60; // seconds

// GET /api/search?q=...
router.get("/search", async (req, res, next) => {
  const q = String(req.query.q || "").trim();

  try {
    if (!q) {
      const recentItems = await prisma.item.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          type: true,
          title: true,
          url: true,
          description: true,
          createdAt: true,
          category: { select: { id: true, name: true } },
        },
      });
      return res.json(recentItems);
    }

    const items = await prisma.item.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { url: { contains: q } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        type: true,
        title: true,
        url: true,
        description: true,
        createdAt: true,
        category: { select: { id: true, name: true } },
      },
    });

    res.json(items);
  } catch (err) {
    if (isExpectedDbError(err)) {
      console.error("[DB] search unavailable:", err.message);
      return res.json([]);
    }
    next(err);
  }
});

// GET /api/categories
router.get("/categories", async (req, res, next) => {
  try {
    const cached = cache.get(CATEGORIES_CACHE_KEY);
    if (cached) {
      return res.json(cached);
    }

    const categoriesFromDb = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        iconKey: true,
        iconColor: true,
        imageUrl: true,
        createdAt: true,
        item: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            title: true,
            type: true,
            url: true,
            description: true,
          },
        },
      },
    });

    // Rename item -> items via destructuring; no spurious 'item: undefined' field sent
    const categories = categoriesFromDb.map(({ item: items, imageUrl, ...rest }) => ({
      ...rest,
      imageUrl: toPublicUrl(imageUrl),
      items,
    }));

    // Only cache when DB query succeeded
    cache.set(CATEGORIES_CACHE_KEY, categories, CATEGORIES_TTL);
    res.json(categories);
  } catch (err) {
    if (isExpectedDbError(err)) {
      console.error("[DB] categories unavailable:", err.message);
      return res.json([]);
    }
    next(err);
  }
});

// GET /api/categories/:id/items
router.get("/categories/:id/items", async (req, res, next) => {
  const { id } = req.params;

  // Input validation: cuid2 IDs are at least 20 characters.
  // Reject anything clearly too short or containing only whitespace.
  if (!id || id.trim().length < 5) {
    return res.status(400).json({ error: "Invalid category id" });
  }

  try {
    const items = await prisma.item.findMany({
      where: { categoryId: id, isActive: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        title: true,
        url: true,
        description: true,
        iconKey: true,
        iconColor: true,
        createdAt: true,
      },
    });
    res.json(items);
  } catch (err) {
    if (isExpectedDbError(err)) {
      console.error("[DB] items fetch unavailable:", err.message);
      return res.json([]);
    }
    next(err);
  }
});

// GET /api/hero
router.get("/hero", async (req, res, next) => {
  try {
    const slides = await prisma.heroslide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    const slidesWithUrls = slides.map((slide) => ({
      ...slide,
      imageUrl: toPublicUrl(slide.imageUrl),
      linkUrl: slide.linkUrl,
    }));

    res.json(slidesWithUrls);
  } catch (err) {
    if (isExpectedDbError(err)) {
      console.error("[DB] hero slides unavailable:", err.message);
      return res.json([]);
    }
    next(err);
  }
});

module.exports = router;
