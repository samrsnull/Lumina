export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth-server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ ok: true, items: [] });
    const doc = await adminDb.collection("carts").doc(user.uid).get();
    const data = doc.exists ? doc.data() : null;
    return NextResponse.json({ ok: true, items: data?.items ?? [] });
  } catch {
    return NextResponse.json({ ok: false, message: "Error leyendo carrito" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ ok: false, message: "No autorizado" }, { status: 401 });
    const body = await req.json();
    const items = Array.isArray(body?.items) ? body.items : [];
    await adminDb.collection("carts").doc(user.uid).set({ items, updatedAt: new Date().toISOString() }, { merge: true });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Error guardando carrito" }, { status: 500 });
  }
}
