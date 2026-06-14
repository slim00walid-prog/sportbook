import { z } from "zod";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, comparePassword, createAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { badRequest, unauthorized, serverError } from "@/lib/http";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = loginSchema.safeParse(payload);

    if (!parsed.success) {
      return badRequest("Email ou mot de passe invalide");
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (!user) {
      return unauthorized("Email ou mot de passe incorrect");
    }

    const isValidPassword = await comparePassword(
      parsed.data.password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      return unauthorized("Email ou mot de passe incorrect");
    }

    const token = createAuthToken({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return serverError();
  }
}
