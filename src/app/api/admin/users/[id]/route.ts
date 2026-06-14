import { UserRole } from "@prisma/client";
import { z } from "zod";
import type { NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { badRequest, forbidden, notFound, ok, serverError, unauthorized } from "@/lib/http";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

const updateUserSchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
});

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const session = getSessionUserFromRequest(request);
    if (!session) return unauthorized();
    if (session.role !== "ADMIN") return forbidden();

    const { id } = await context.params;
    const payload = await request.json();
    const parsed = updateUserSchema.safeParse(payload);
    if (!parsed.success) return badRequest("Donnees invalides");

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return notFound("Utilisateur introuvable");

    const updated = await prisma.user.update({
      where: { id },
      data: parsed.data,
      select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true },
    });
    return ok({ user: updated });
  } catch { return serverError(); }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const session = getSessionUserFromRequest(request);
    if (!session) return unauthorized();
    if (session.role !== "ADMIN") return forbidden();

    const { id } = await context.params;
    if (id === session.id) return badRequest("Vous ne pouvez pas supprimer votre propre compte");

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return notFound("Utilisateur introuvable");

    await prisma.user.delete({ where: { id } });
    return ok({ success: true });
  } catch { return serverError(); }
}
