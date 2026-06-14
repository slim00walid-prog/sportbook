import {
  Prisma,
  ReservationStatus,
  ReviewStatus,
  SportType,
} from "@prisma/client";
import { z } from "zod";
import type { NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { badRequest, forbidden, ok, serverError, unauthorized } from "@/lib/http";
import { prisma } from "@/lib/prisma";


const createTerrainSchema = z.object({
  complexId: z.string().cuid(),
  name: z.string().min(2),
  sportType: z.nativeEnum(SportType),
  pricePerHourCents: z.number().int().positive(),
  openTime: z.string().regex(/^\d{2}:\d{2}$/),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/),
  equipment: z.array(z.string()).default([]),
  photos: z.array(z.string().url()).default([]),
});

export async function GET(request: NextRequest) {
  const sportType = request.nextUrl.searchParams.get("sportType");
  const city = request.nextUrl.searchParams.get("city");
  const district = request.nextUrl.searchParams.get("district");
  const maxPrice = request.nextUrl.searchParams.get("maxPrice");
  const startAt = request.nextUrl.searchParams.get("startAt");
  const endAt = request.nextUrl.searchParams.get("endAt");

  const where: Prisma.TerrainWhereInput = {
    sportType: sportType && sportType in SportType ? (sportType as SportType) : undefined,
    pricePerHourCents: maxPrice ? { lte: Number(maxPrice) * 100 } : undefined,
    complex: {
      city: city ? { contains: city, mode: "insensitive" as const } : undefined,
      district: district
        ? { contains: district, mode: "insensitive" as const }
        : undefined,
    },
    reservations:
      startAt && endAt
        ? {
            none: {
              status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
              startAt: { lt: new Date(endAt) },
              endAt: { gt: new Date(startAt) },
            },
          }
        : undefined,
    maintenanceBlocks:
      startAt && endAt
        ? {
            none: {
              startAt: { lt: new Date(endAt) },
              endAt: { gt: new Date(startAt) },
            },
          }
        : undefined,
  };

  const terrains = await prisma.terrain.findMany({
    where,
    include: {
      complex: true,
      reviews: {
        where: { status: ReviewStatus.APPROVED },
        select: { rating: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return ok({
    terrains: terrains.map((terrain) => {
      const avgRating =
        terrain.reviews.length === 0
          ? null
          :
              terrain.reviews.reduce((sum, review) => sum + review.rating, 0) /
              terrain.reviews.length;

      return {
        ...terrain,
        avgRating,
        reviews: undefined,
      };
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = getSessionUserFromRequest(request);
    if (!session) {
      return unauthorized();
    }

    if (!["MANAGER", "ADMIN"].includes(session.role)) {
      return forbidden();
    }

    const payload = await request.json();
    const parsed = createTerrainSchema.safeParse(payload);
    if (!parsed.success) {
      return badRequest("Donnees invalides");
    }

    const complex = await prisma.complex.findUnique({
      where: { id: parsed.data.complexId },
      select: { managerId: true },
    });

    if (!complex) {
      return badRequest("Complexe introuvable");
    }

    if (session.role === "MANAGER" && complex.managerId !== session.id) {
      return forbidden("Vous ne pouvez pas modifier ce complexe");
    }

    const terrain = await prisma.terrain.create({
      data: parsed.data,
      include: { complex: true },
    });

    return ok({ terrain }, { status: 201 });
  } catch {
    return serverError();
  }
}
