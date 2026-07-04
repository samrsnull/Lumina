export const runtime = "nodejs";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const session_id = url.searchParams.get("session_id");
    if (!session_id) return NextResponse.json({ ok: false, message: "Missing session_id" }, { status: 400 });

    const secret = process.env.STRIPE_SECRET;
    if (!secret) {
      // Stripe not configured — simulate a paid session
      return NextResponse.json({ ok: true, paid: true });
    }

    const stripe = new Stripe(secret, {} as Stripe.StripeConfig);
    const session = await stripe.checkout.sessions.retrieve(session_id as string);
    // payment_status can be 'paid' when completed
    const paid = (session.payment_status === "paid") || (session.status === "complete");

    // Try to fetch line items for more detailed summary
    let items: Array<Record<string, unknown>> = [];
    try {
      const list = await stripe.checkout.sessions.listLineItems(session_id as string, { limit: 100 });
      items = list.data.map(li => ({ description: li.description, quantity: li.quantity, amount_total: li.amount_total, price: li.price?.unit_amount, currency: li.currency }));
    } catch {
      // ignore line items errors
    }

    const details = {
      id: session.id,
      paid,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_details: session.customer_details ?? null,
      items,
    };

    return NextResponse.json({ ok: true, ...details });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, message: msg ?? "Error verifying session" }, { status: 500 });
  }
}
