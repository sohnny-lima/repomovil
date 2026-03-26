const prisma = require('./src/prisma');
const fs = require('fs');

async function main() {
  try {
    const ministries = await prisma.ministry.findMany();
    const categories = await prisma.category.findMany();
    fs.writeFileSync('output.json', JSON.stringify({ ministries, categories }, null, 2));
  } catch (e) {
    fs.writeFileSync('error.txt', e.toString());
  } finally {
    await prisma.$disconnect();
  }
}

main();
