export const runtime = "nodejs";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cart = Array.isArray(body?.cart) ? (body.cart as unknown[]) : [];
    const secret = process.env.STRIPE_SECRET;
    const currency = process.env.STRIPE_CURRENCY || "MXN";
    if (!secret) {
      // Stripe not configured: return helpful message
      const subtotal = cart.reduce((s: number, it: unknown) => {
        const price = getNumber(it, ["price", "precio"]);
        const qty = getNumber(it, ["qty", "cantidad"]) || 1;
        return s + price * qty;
      }, 0);
      const shipping = subtotal > 0 ? 200 : 0;
      const total = subtotal + shipping;
      return NextResponse.json({ ok: true, message: `Pago simulado. Total: $${total}`, url: null });
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    // Do not force an API version here — let the installed Stripe library
    // use its default version. Forcing an unsupported version caused
    // `Invalid Stripe API version` errors in some environments.
    const stripe = new Stripe(secret);

    const line_items = cart.map((it: unknown) => {
      const unitPrice = Math.round(getNumber(it, ["price", "precio"]) * 100);
      const name = getString(it, ["name", "nombre"]) || "Producto";
      const image = getString(it, ["image"]);
      const quantity = Math.max(1, Math.round(getNumber(it, ["qty", "cantidad"]) || 1));
      return {
        price_data: {
          currency,
          product_data: {
            name,
            images: image ? [image] : undefined,
          },
          unit_amount: unitPrice,
        },
        quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      // Redirect directly to the confirmation page so we don't show the intermediate
      // internal payment form (`/pago`). The confirmation page will verify the
      // session and display order details.
      success_url: `${origin}/pago/realizado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/carrito`,
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, message: msg ?? "Error procesando checkout" }, { status: 500 });
  }
}

function getNumber(obj: unknown, keys: string[]) {
  if (typeof obj !== "object" || obj === null) return 0;
  for (const k of keys) {
    const v = (obj as Record<string, unknown>)[k];
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  }
  return 0;
}

function getString(obj: unknown, keys: string[]) {
  if (typeof obj !== "object" || obj === null) return "";
  for (const k of keys) {
    const v = (obj as Record<string, unknown>)[k];
    if (typeof v === "string") return v;
    if (typeof v === "number") return String(v);
  }
  return "";
}
