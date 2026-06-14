import { z } from "zod";
import type { NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import {
  badRequest,
  forbidden,
  ok,
  serverError,
  unauthorized,
} from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { isWithinOpeningHours } from "@/lib/time";

const createReservationSchema = z.object({
  terrainId: z.string().cuid(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  paymentProvider: z.enum(["STRIPE", "PAYPAL"]).default("STRIPE"),
});

export async function GET(request: NextRequest) {
  const session = getSessionUserFromRequest(request);
  if (!session) {
    return unauthorized();
  }

  const where =
    session.role === "USER"
      ? { userId: session.id }
      : session.role === "MANAGER"
        ? { terrain: { complex: { managerId: session.id } } }
        : {};

  const reservations = await prisma.reservation.findMany({
    where,
    include: {
      terrain: {
        include: {
          complex: true,
        },
      },
      user: {
        select: { firstName: true, lastName: true, email: true },
      },
      payment: true,
    },
    orderBy: { startAt: "desc" },
  });

  return ok({ reservations });
}

export async function POST(request: NextRequest) {
  try {
    const session = getSessionUserFromRequest(request);
    if (!session) {
      return unauthorized();
    }

    if (session.role !== "USER") {
      return forbidden("Seuls les utilisateurs peuvent reserver");
    }

    const payload = await request.json();
    const parsed = createReservationSchema.safeParse(payload);
    if (!parsed.success) {
      return badRequest("Donnees invalides");
    }

    const { terrainId, startAt, endAt, paymentProvider } = parsed.data;

    if (endAt <= startAt) {
      return badRequest("La plage horaire est invalide");
    }

    const terrain = await prisma.terrain.findUnique({ where: { id: terrainId } });
    if (!terrain) {
      return badRequest("Terrain introuvable");
    }

    const now = new Date();
    if (startAt <= now) {
      return badRequest("Vous devez reserver un creneau futur");
    }

    if (!isWithinOpeningHours(startAt, endAt, terrain.openTime, terrain.closeTime)) {
      return badRequest("Le creneau est en dehors des horaires d'ouverture");
    }

    const overlap = await prisma.reservation.findFirst({
      where: {
        terrainId,
        status: { in: ["PENDING", "CONFIRMED"] },
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
    });

    if (overlap) {
      return badRequest("Ce creneau est deja reserve");
    }

    const maintenanceBlock = await prisma.maintenanceBlock.findFirst({
      where: {
        terrainId,
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
    });

    if (maintenanceBlock) {
      return badRequest("Ce terrain est indisponible (maintenance)");
    }

    const durationMs = endAt.getTime() - startAt.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    const totalCents = Math.round(durationHours * terrain.pricePerHourCents);

    const reservation = await prisma.reservation.create({
      data: {
        userId: session.id,
        terrainId,
        startAt,
        endAt,
        totalCents,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        payment: {
          create: {
            provider: paymentProvider,
            amountCents: totalCents,
            status: "PAID",
            transactionId: `mock_${Date.now()}`,
          },
        },
      },
      include: {
        terrain: {
          include: {
            complex: true,
          },
        },
        payment: true,
      },
    });

    return ok(
      {
        reservation,
        notifications: {
          email: "envoye (mock)",
          sms: "envoye (mock)",
        },
      },
      { status: 201 },
    );
  } catch {
    return serverError();
  }
}
