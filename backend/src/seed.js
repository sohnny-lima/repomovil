require("dotenv").config();
const bcrypt = require("bcrypt");
const prisma = require("./prisma");

async function main() {
  const email = "admin@repomovil.com";
  const password = "Admin12345";

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, role: "ADMIN" },
  });

  console.log("✅ Admin creado/listo:", admin.email);
  console.log("🔑 Password:", password);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
