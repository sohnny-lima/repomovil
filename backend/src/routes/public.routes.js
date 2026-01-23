const router = require("express").Router();
const prisma = require("../prisma");

// GET /api/search?q=...
router.get("/search", async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json([]);

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
    select: { id: true, name: true, description: true, createdAt: true },
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
      createdAt: true,
    },
  });

  res.json(items);
});

module.exports = router;
