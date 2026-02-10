const router = require("express").Router();
const prisma = require("../prisma");
const { toPublicUrl } = require("../utils/urlHelper");

// GET /api/search?q=...
// GET /api/search?q=...
router.get("/search", async (req, res) => {
  const q = String(req.query.q || "").trim();
  
  if (!q) {
    // If no query, return recent items
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
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { url: { contains: q, mode: "insensitive" } },
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
});

// GET /api/categories
router.get("/categories", async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    select: { 
      id: true, 
      name: true, 
      description: true, 
      iconKey: true, 
      iconColor: true, 
      createdAt: true,
      items: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: 5, // Limit to 5 per category for home screen? Or all? User said "visualizarlo", let's take 5 for preview or all. Let's take 10 to be safe.
        select: {
            id: true,
            title: true,
            type: true,
            url: true,
            description: true
        }
      }
    },
  });
  res.json(categories);
});

// GET /api/categories/:id/items
router.get("/categories/:id/items", async (req, res) => {
  const { id } = req.params;

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
});

// GET /api/hero
router.get("/hero", async (req, res) => {
  const slides = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  
  // Construir URLs públicas completas
  const slidesWithUrls = slides.map(slide => ({
    ...slide,
    imageUrl: toPublicUrl(slide.imageUrl),
    linkUrl: slide.linkUrl, // linkUrl es externo, no necesita transformación
  }));
  
  res.json(slidesWithUrls);
});

module.exports = router;
