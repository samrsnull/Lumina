import { adminAuth } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

const COOKIE = process.env.SESSION_COOKIE_NAME ?? "__session";
const MAX_AGE = Number(process.env.SESSION_COOKIE_MAX_AGE ?? 60 * 60 * 8); // por defecto 8h

export async function POST(req: Request) {
  try {
    const { idToken, remember } = await req.json();

    if (!idToken)
      return NextResponse.json(
        { error: "Falta idToken, el token que te arroja Firebase!" },
        { status: 400 }
      );

    // Tiempo de expiración en milisegundos
    const expiresIn = (remember ? MAX_AGE : 2 * 60 * 60) * 1000;

    // Crear la cookie de sesión
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: remember ? MAX_AGE : undefined,
    });

    return res;
  } catch (err) {
    console.error("Error creando cookie:", err);
    return NextResponse.json(
      { error: "No se pudo crear la cookie de sesión." },
      { status: 401 }
    );
  }
}
