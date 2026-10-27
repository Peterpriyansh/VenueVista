const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const cities = [
  "Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Pune",
  "Jaipur", "Chandigarh", "Lucknow", "Kolkata", "Chennai"
];

const categories = [
  "Music", "Comedy", "Technology", "Sports", "Food",
  "Art", "Theatre", "Workshop", "Festival", "Nightlife"
];

const eventNames = [
  "Live Music Night", "Stand-up Comedy Special",
  "Startup & Innovation Summit", "Weekend Sports Experience",
  "Street Food Festival", "Contemporary Art Showcase",
  "Theatre Live", "Creative Skills Workshop",
  "City Cultural Festival", "DJ Experience"
];

async function main() {
  for (let i = 0; i < 100; i++) {
    const city = cities[i % cities.length];
    const category = categories[i % categories.length];
    const title = `${eventNames[i % eventNames.length]} - ${city} ${i + 1}`;
    const startsAt = new Date();
    startsAt.setDate(startsAt.getDate() + 7 + i);

    await prisma.event.upsert({
      where: { id: `vv-demo-event-${String(i + 1).padStart(3, "0")}` },
      update: {},
      create: {
        id: `vv-demo-event-${String(i + 1).padStart(3, "0")}`,
        title,
        description: `Demo ${category.toLowerCase()} event in ${city}. This sample listing is for VenueVista development and testing.`,
        category,
        venue: `${city} Events Arena`,
        city,
        startsAt,
        endsAt: new Date(startsAt.getTime() + 3 * 60 * 60 * 1000),
        imageUrl: null,
        priceInPaise: (499 + (i % 10) * 200) * 100,
        totalTickets: 200,
        availableTickets: 200,
        isPublished: true
      }
    });
  }

  console.log("Seed complete: 100 demo events are ready.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
