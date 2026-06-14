import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  // Admin — created by seed (super admin)
  await prisma.user.upsert({
    where: { email: "admin@sportbook.local" },
    update: {},
    create: {
      email: "admin@sportbook.local",
      passwordHash,
      firstName: "Admin",
      lastName: "SportBook",
      role: "ADMIN",
      phone: "+212600000001",
    },
  });

  // Manager — created by Admin in real flow
  const manager = await prisma.user.upsert({
    where: { email: "manager@sportbook.local" },
    update: {},
    create: {
      email: "manager@sportbook.local",
      passwordHash,
      firstName: "Sara",
      lastName: "Manager",
      role: "MANAGER",
      phone: "+212600000002",
    },
  });

  // User — standard client
  await prisma.user.upsert({
    where: { email: "user@sportbook.local" },
    update: {},
    create: {
      email: "user@sportbook.local",
      passwordHash,
      firstName: "Yassine",
      lastName: "Client",
      role: "USER",
      phone: "+212600000003",
    },
  });

  const complexManager = await prisma.complex.findFirst({
    where: { name: "SportBook Centre", city: "Casablanca" },
  });

  const complex = complexManager ?? await prisma.complex.create({
    data: {
      name: "SportBook Centre",
      city: "Casablanca",
      district: "Maarif",
      address: "15 Rue du Stade",
      description: "Complexe multi-sports premium",
      managerId: manager.id,
    },
  });

const existingCount = await prisma.terrain.count({ where: { complexId: complex.id } });

  if (existingCount === 0) {
    await prisma.terrain.createMany({
      data: [
        { complexId: complex.id, name: "Terrain Elite 5v5", sportType: "FOOTBALL", pricePerHourCents: 3000, openTime: "08:00", closeTime: "23:00", equipment: ["Vestiaires", "Douches", "Parking", "Éclairage"], photos: [] },
        { complexId: complex.id, name: "Court Padel A", sportType: "PADEL", pricePerHourCents: 2200, openTime: "08:00", closeTime: "22:00", equipment: ["Vestiaires", "Parking", "Éclairage"], photos: [] },
        { complexId: complex.id, name: "Court Tennis Central", sportType: "TENNIS", pricePerHourCents: 1800, openTime: "07:00", closeTime: "21:00", equipment: ["Vestiaires", "Douches"], photos: [] },
        { complexId: complex.id, name: "Terrain Basket 3x3", sportType: "BASKETBALL", pricePerHourCents: 1500, openTime: "09:00", closeTime: "22:00", equipment: ["Vestiaires", "Parking"], photos: [] },
      ],
    });
  }
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });
