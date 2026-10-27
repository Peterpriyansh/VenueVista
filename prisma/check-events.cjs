const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.event.count();
  console.log("Total events in database:", count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
