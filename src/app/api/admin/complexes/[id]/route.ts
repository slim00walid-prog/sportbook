import { z } from "zod";
import type { NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { badRequest, forbidden, notFound, ok, serverError, unauthorized } from "@/lib/http";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  district: z.string().min(2).optional(),
  address: z.string().min(5).optional(),
  description: z.string().optional(),
  managerId: z.string().cuid().nullable().optional(),
});

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const session = getSessionUserFromRequest(request);
    if (!session) return unauthorized();
    if (session.role !== "ADMIN") return forbidden();

    const { id } = await context.params;
    const payload = await request.json();
    const parsed = updateSchema.safeParse(payload);
    if (!parsed.success) return badRequest("Donnees invalides");

    const existing = await prisma.complex.findUnique({ where: { id } });
    if (!existing) return notFound("Complexe introuvable");

    const data: Record<string, unknown> = { ...parsed.data };
    if (data.managerId === null) {
      data.managerId = null;
    }

    const complex = await prisma.complex.update({
      where: { id },
      data,
      include: {
        manager: { select: { id: true, firstName: true, lastName: true, email: true } },
        terrains: { select: { id: true, name: true, sportType: true } },
      },
    });

    return ok({ complex });
  } catch {
    return serverError();
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const session = getSessionUserFromRequest(request);
    if (!session) return unauthorized();
    if (session.role !== "ADMIN") return forbidden();

    const { id } = await context.params;
    const existing = await prisma.complex.findUnique({ where: { id } });
    if (!existing) return notFound("Complexe introuvable");

    await prisma.complex.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return serverError();
  }
}
