import { getSessionUserFromRequest } from "@/lib/auth";
import { forbidden, ok, serverError, unauthorized } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = getSessionUserFromRequest(request);
    if (!session) return unauthorized();
    if (session.role !== "ADMIN") return forbidden();

    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return ok({ users });
  } catch { return serverError(); }
}
