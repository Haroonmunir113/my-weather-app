// import { PrismaClient, Prisma } from "../app/generated/prisma/client";
// import { PrismaPg } from '@prisma/adapter-pg'
// import 'dotenv/config'

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL,
// })

// const prisma = new PrismaClient({
//   adapter,
// });

// const userData: Prisma.UserCreateInput[] = [
//   {
//     name: "Alice",
//     email: "alice@prisma.io",
//     posts: {
//       create: [
//         {
//           title: "Join the Prisma Discord",
//           content: "https://pris.ly/discord",
//           published: true,
//         },
//         {
//           title: "Prisma on YouTube",
//           content: "https://pris.ly/youtube",
//         },
//       ],
//     },
//   },
//   {
//     name: "Bob",
//     email: "bob@prisma.io",
//     posts: {
//       create: [
//         {
//           title: "Follow Prisma on Twitter",
//           content: "https://www.twitter.com/prisma",
//           published: true,
//         },
//       ],
//     },
//   },
// ];

// export async function main() {
//   for (const u of userData) {
//     await prisma.user.create({ data: u });
//   }
// }

// main();

// prisma/seed.ts
// prisma/seed.ts

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting seed...");

  await prisma.favorite.deleteMany({});
  await prisma.weather.deleteMany({});
  await prisma.city.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🧹 Cleared existing data");

  const user1 = await prisma.user.create({
    data: {
      name: "Alice Johnson",
      email: "alice@example.com",
      password: "password123",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Bob Smith",
      email: "bob@example.com",
      password: "password456",
    },
  });

  console.log(`👤 Created users: ${user1.name}, ${user2.name}`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });