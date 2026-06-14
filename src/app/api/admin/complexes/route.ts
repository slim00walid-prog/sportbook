import { z } from "zod";
import type { NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { badRequest, forbidden, ok, serverError, unauthorized } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  district: z.string().min(2),
  address: z.string().min(5),
  description: z.string().optional(),
  managerId: z.string().cuid().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = getSessionUserFromRequest(request);
    if (!session) return unauthorized();
    if (session.role !== "ADMIN") return forbidden();

    const complexes = await prisma.complex.findMany({
      include: { manager: { select: { id: true, firstName: true, lastName: true, email: true } }, terrains: { select: { id: true, name: true, sportType: true } } },
      orderBy: { createdAt: "desc" },
    });
    return ok({ complexes });
  } catch { return serverError(); }
}

export async function POST(request: NextRequest) {
  try {
    const session = getSessionUserFromRequest(request);
    if (!session) return unauthorized();
    if (session.role !== "ADMIN") return forbidden();

    const payload = await request.json();
    const parsed = createSchema.safeParse(payload);
    if (!parsed.success) return badRequest("Donnees invalides");

    const complex = await prisma.complex.create({ data: parsed.data, include: { manager: { select: { id: true, firstName: true, lastName: true, email: true } } } });
    return ok({ complex }, { status: 201 });
  } catch { return serverError(); }
}
