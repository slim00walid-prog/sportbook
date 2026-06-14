import { z } from "zod";
import type { NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { badRequest, ok, serverError, unauthorized } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  terrainId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = getSessionUserFromRequest(request);
    if (!session) {
      return unauthorized();
    }

    const payload = await request.json();
    const parsed = reviewSchema.safeParse(payload);

    if (!parsed.success) {
      return badRequest("Donnees invalides");
    }

    const existingReservation = await prisma.reservation.findFirst({
      where: {
        userId: session.id,
        terrainId: parsed.data.terrainId,
        status: "CONFIRMED",
      },
    });

    if (!existingReservation) {
      return badRequest("Vous devez avoir reserve ce terrain pour laisser un avis");
    }

    const review = await prisma.review.create({
      data: {
        userId: session.id,
        terrainId: parsed.data.terrainId,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
        status: "APPROVED",
      },
    });

    return ok({ review }, { status: 201 });
  } catch {
    return serverError();
  }
}
