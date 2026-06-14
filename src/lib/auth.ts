import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

export const AUTH_COOKIE_NAME = "sportbook_token";

export type SessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "MANAGER" | "ADMIN";
};

const jwtSecret = process.env.JWT_SECRET ?? "dev_jwt_secret_change_me";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createAuthToken(user: SessionUser) {
  return jwt.sign(user, jwtSecret, { expiresIn: "7d" });
}

export function verifyAuthToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, jwtSecret) as SessionUser;
  } catch {
    return null;
  }
}

export function getSessionUserFromRequest(request: NextRequest): SessionUser | null {
  const bearer = request.headers.get("authorization");
  const tokenFromHeader = bearer?.startsWith("Bearer ")
    ? bearer.slice("Bearer ".length)
    : null;
  const token = tokenFromHeader ?? request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifyAuthToken(token);
}
