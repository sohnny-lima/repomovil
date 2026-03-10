require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("./prisma");

async function main() {
  console.log("🌱 Starting seed...");

  const email = "admin@gmail.com";
  const passwordPlain = "123456";

  const passwordHash = await bcrypt.hash(passwordPlain, 10);

  console.log("👤 Creating admin user...");

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

  console.log("✅ Admin created!");
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
