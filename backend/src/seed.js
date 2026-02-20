require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("./prisma");

async function main() {
  console.log("🌱 Starting seed...");

  try {
    const email = "admin@repomovil.com";
    const passwordPlain = "123456";
    const passwordHash = await bcrypt.hash(passwordPlain, 10);

    // Schema uses 'passwordHash', NOT 'password'
    // Model is 'adminuser' (lowercase in schema with @@map("AdminUser"))
    // accessing via prisma.adminuser (lowercase property on client)
    const admin = await prisma.adminuser.upsert({
      where: { email },
      update: {
        passwordHash: passwordHash,
        role: "ADMIN",
      },
      create: {
        email,
        passwordHash: passwordHash,
        role: "ADMIN",
      },
    });

    console.log("✅ Admin user seeded:", {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });
    console.log("🔐 Login =>", email, "/", passwordPlain);
  } catch (e) {
    console.error("❌ Seed error:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
