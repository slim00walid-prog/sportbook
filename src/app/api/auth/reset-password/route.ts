import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { badRequest, ok, serverError } from "@/lib/http";

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = resetSchema.safeParse(payload);
    if (!parsed.success) return badRequest("Token ou mot de passe invalide");

    const { token, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    });

    if (!user) return badRequest("Token invalide");
    if (!user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
      return badRequest("Token expiré");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(password),
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    return ok({ message: "Mot de passe réinitialisé avec succès." });
  } catch {
    return serverError();
  }
}
