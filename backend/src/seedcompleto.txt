require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("./prisma");
const { categories, items } = require("./seed-data");

async function main() {
  console.log("🌱 Starting seed...");

  /**
   * ⚠️ Reset de contenido
   * Solo se ejecuta si la variable de entorno RESET_CONTENT=true
   * Ejemplo:
   * Windows:
   * set RESET_CONTENT=true && node src/seed.js
   *
   * Linux/VPS:
   * RESET_CONTENT=true node src/seed.js
   */
  const RESET_CONTENT = process.env.RESET_CONTENT === "true";

  if (RESET_CONTENT) {
    console.log("🧹 Resetting content (items/categories)...");
    await prisma.item.deleteMany({});
    await prisma.category.deleteMany({});
  }

  /**
   * 👤 ADMIN USER
   */
  const email = "admin@repomovil.com";
  const passwordPlain = "123456";
  const passwordHash = await bcrypt.hash(passwordPlain, 10);

  console.log("👤 Seeding admin user...");

  await prisma.adminuser.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "ADMIN",
    },
    create: {
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  /**
   * 📦 CATEGORIES
   */
  console.log(`📦 Seeding categories (${categories.length})...`);

  for (const c of categories) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: {
        name: c.name,
        description: c.description,
        iconKey: c.iconKey,
        iconColor: c.iconColor,
        imageUrl: c.imageUrl,
        isActive: c.isActive ?? true,
      },
      create: {
        id: c.id,
        name: c.name,
        description: c.description,
        iconKey: c.iconKey,
        iconColor: c.iconColor,
        imageUrl: c.imageUrl,
        isActive: c.isActive ?? true,
      },
    });
  }

  /**
   * 🔗 ITEMS
   */
  console.log(`🔗 Seeding items (${items.length})...`);

  for (const it of items) {
    await prisma.item.upsert({
      where: { id: it.id },
      update: {
        categoryId: it.categoryId,
        type: it.type,
        title: it.title,
        url: it.url,
        description: it.description,
        iconKey: it.iconKey,
        iconColor: it.iconColor,
        isActive: it.isActive ?? true,
      },
      create: {
        id: it.id,
        categoryId: it.categoryId,
        type: it.type,
        title: it.title,
        url: it.url,
        description: it.description,
        iconKey: it.iconKey,
        iconColor: it.iconColor,
        isActive: it.isActive ?? true,
      },
    });
  }

  console.log("✅ Seed completed successfully!");
  console.log("🔐 Admin login:");
  console.log("📧 Email:", email);
  console.log("🔑 Password:", passwordPlain);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
