import { SportType } from "@prisma/client";
import { z } from "zod";
import type { NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { badRequest, forbidden, notFound, ok, serverError, unauthorized } from "@/lib/http";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  sportType: z.nativeEnum(SportType).optional(),
  pricePerHourCents: z.number().int().positive().optional(),
  openTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  equipment: z.array(z.string()).optional(),
  photos: z.array(z.string().url()).optional(),
});

export async function GET(_request: NextRequest, context: Context) {
  const { id } = await context.params;
  const terrain = await prisma.terrain.findUnique({
    where: { id },
    include: {
      complex: true,
      reviews: {
        where: { status: "APPROVED" },
        include: { user: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!terrain) return notFound("Terrain introuvable");
  const avgRating = terrain.reviews.length === 0 ? null
    : terrain.reviews.reduce((s, r) => s + r.rating, 0) / terrain.reviews.length;
  return ok({ terrain: { ...terrain, avgRating } });
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const session = getSessionUserFromRequest(request);
    if (!session) return unauthorized();
    if (!["MANAGER", "ADMIN"].includes(session.role)) return forbidden();
    const { id } = await context.params;
    const payload = await request.json();
    const parsed = updateSchema.safeParse(payload);
    if (!parsed.success) return badRequest("Donnees invalides");
    const terrain = await prisma.terrain.findUnique({ where: { id }, include: { complex: true } });
    if (!terrain) return notFound("Terrain introuvable");
    if (session.role === "MANAGER" && terrain.complex.managerId !== session.id) return forbidden();
    const updated = await prisma.terrain.update({ where: { id }, data: parsed.data, include: { complex: true } });
    return ok({ terrain: updated });
  } catch { return serverError(); }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const session = getSessionUserFromRequest(request);
    if (!session) return unauthorized();
    if (!["MANAGER", "ADMIN"].includes(session.role)) return forbidden();
    const { id } = await context.params;
    const terrain = await prisma.terrain.findUnique({ where: { id }, include: { complex: true } });
    if (!terrain) return notFound("Terrain introuvable");
    if (session.role === "MANAGER" && terrain.complex.managerId !== session.id) return forbidden();
    await prisma.terrain.delete({ where: { id } });
    return ok({ success: true });
  } catch { return serverError(); }
}
