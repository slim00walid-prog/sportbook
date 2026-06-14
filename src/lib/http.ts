import { NextResponse } from "next/server";

export function ok(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorized(message = "Non authentifie") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Acces refuse") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function notFound(message = "Ressource introuvable") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message = "Erreur serveur") {
  return NextResponse.json({ error: message }, { status: 500 });
}
