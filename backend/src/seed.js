require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("./prisma");

const DEFAULT_MINISTRIES = [
  { name: "Mayordomía", slug: "mayordomia", description: "Ministerio de Mayordomía", isDefault: true },
  { name: "Secretaría Ministerial", slug: "secretaria-ministerial", description: "Secretaría Ministerial", isDefault: true },
  { name: "Salud", slug: "salud", description: "Ministerio de Salud", isDefault: true },
  { name: "Familia", slug: "familia", description: "Ministerio de Familia", isDefault: true },
  { name: "MAP", slug: "map", description: "Ministerio de Alcance Público", isDefault: true },
];

async function main() {
  console.log("🌱 Starting seed...");

  // ── Admin user ────────────────────────────────────────────────────
  const email = "admin@gmail.com";
  const passwordPlain = "123456";
  const passwordHash = await bcrypt.hash(passwordPlain, 10);

  console.log("👤 Creating admin user...");
  await prisma.adminuser.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN" },
    create: { email, passwordHash, role: "ADMIN" },
  });
  console.log("✅ Admin created! Email:", email, "| Password:", passwordPlain);

  // ── Default Ministries ────────────────────────────────────────────
  console.log("⛪ Creating default ministries...");
  for (const m of DEFAULT_MINISTRIES) {
    await prisma.ministry.upsert({
      where: { slug: m.slug },
      update: { name: m.name, description: m.description, isDefault: m.isDefault },
      create: m,
    });
    console.log(`  ✅ Ministry: ${m.name}`);
  }

  // ── Assign existing categories to Mayordomía ──────────────────────
  const mayordomia = await prisma.ministry.findUnique({ where: { slug: "mayordomia" } });
  if (mayordomia) {
    const updated = await prisma.category.updateMany({
      where: { ministryId: null },
      data: { ministryId: mayordomia.id },
    });
    console.log(`📂 Assigned ${updated.count} existing categories to Mayordomía`);
  }

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
