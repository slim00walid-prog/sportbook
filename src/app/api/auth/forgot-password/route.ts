import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { badRequest, ok, serverError } from "@/lib/http";

const forgotSchema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = forgotSchema.safeParse(payload);
    if (!parsed.success) return badRequest("Email invalide");

    const email = parsed.data.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Return ok even if user not found (security: don't reveal existence)
      return ok({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiresAt },
    });

    // In production, send email. For MVP, return token in response.
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/reset-password?token=${resetToken}`;

    return ok({ message: "Si cet email existe, un lien de réinitialisation a été envoyé.", resetUrl });
  } catch {
    return serverError();
  }
}
