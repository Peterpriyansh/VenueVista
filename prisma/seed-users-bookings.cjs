const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(
    "VV-Demo-2026!ChangeMe",
    12
  );

  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { id: "asc" },
    take: 100,
    select: { id: true, priceInPaise: true }
  });

  if (events.length === 0) {
    throw new Error("No published events found. Seed events first.");
  }

  const users = [];

  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.upsert({
      where: { email: `demo${i}@venuevista.test` },
      update: {},
      create: {
        fullName: `Demo User ${i}`,
        email: `demo${i}@venuevista.test`,
        passwordHash,
        role: "CUSTOMER"
      }
    });

    users.push(user);
  }

  for (let i = 0; i < 50; i++) {
    const user = users[i % users.length];
    const event = events[i % events.length];
    const quantity = (i % 3) + 1;
    const bookingReference = `VVDEMO${String(i + 1).padStart(5, "0")}`;

    await prisma.booking.upsert({
      where: { bookingReference },
      update: {},
      create: {
        bookingReference,
        userId: user.id,
        eventId: event.id,
        quantity,
        unitPriceInPaise: event.priceInPaise,
        totalAmountInPaise: event.priceInPaise * quantity,
        status: "CONFIRMED",
        paymentStatus: "SUCCEEDED"
      }
    });
  }

  const [userCount, bookingCount, eventCount] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.event.count()
  ]);

  console.log("Seed complete!");
  console.log("Total events:", eventCount);
  console.log("Total users:", userCount);
  console.log("Total bookings:", bookingCount);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
