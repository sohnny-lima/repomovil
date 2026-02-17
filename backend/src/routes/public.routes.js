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
  try {
    const categoriesFromDb = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: { 
        id: true, 
        name: true, 
        description: true, 
        iconKey: true, 
        iconColor: true, 
        imageUrl: true, // Agregado campo de imagen
        createdAt: true,
        // El usuario reportó que la relación se llama 'item' (singular) en su esquema actual
        item: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
          take: 5,
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

    // Mapear 'item' a 'items' y transformar imageUrl a URL pública completa
    const categories = categoriesFromDb.map(c => ({
      ...c,
      imageUrl: toPublicUrl(c.imageUrl), // Transformar a URL completa
      items: c.item,
      item: undefined
    }));

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
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
  try {
    // El usuario reportó que el modelo se accede como 'heroslide' (minúscula)
    const slides = await prisma.heroslide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    
    // Construir URLs públicas completas
    const slidesWithUrls = slides.map(slide => ({
      ...slide,
      imageUrl: toPublicUrl(slide.imageUrl),
      linkUrl: slide.linkUrl, 
    }));
    
    res.json(slidesWithUrls);
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    // Intentar con HeroSlide por si acaso (fallback)
    try {
      if (prisma.HeroSlide) {
         const slides = await prisma.HeroSlide.findMany({
          where: { isActive: true },
          orderBy: { order: "asc" },
        });
        const slidesWithUrls = slides.map(slide => ({
          ...slide,
          imageUrl: toPublicUrl(slide.imageUrl),
          linkUrl: slide.linkUrl, 
        }));
        return res.json(slidesWithUrls);
      }
      res.status(500).json({ error: "Error fetching hero slides" });
    } catch (e) {
      res.status(500).json({ error: "Error fetching hero slides" });
    }
  }
});

module.exports = router;
