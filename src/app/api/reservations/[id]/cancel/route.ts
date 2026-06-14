import type { NextRequest } from "next/server";
import {
  badRequest,
  forbidden,
  notFound,
  ok,
  serverError,
  unauthorized,
} from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const session = getSessionUserFromRequest(request);
    if (!session) {
      return unauthorized();
    }

    const { id } = await context.params;
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        terrain: {
          include: {
            complex: true,
          },
        },
      },
    });

    if (!reservation) {
      return notFound("Reservation introuvable");
    }

    const canCancel =
      session.role === "ADMIN" ||
      reservation.userId === session.id ||
      (session.role === "MANAGER" && reservation.terrain.complex.managerId === session.id);

    if (!canCancel) {
      return forbidden("Vous ne pouvez pas annuler cette reservation");
    }

    if (reservation.status === "CANCELLED") {
      return badRequest("Reservation deja annulee");
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        status: "CANCELLED",
        paymentStatus: "REFUNDED",
        payment: {
          update: {
            status: "REFUNDED",
          },
        },
      },
      include: {
        payment: true,
      },
    });

    return ok({ reservation: updated });
  } catch {
    return serverError();
  }
}
