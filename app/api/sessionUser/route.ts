export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

const COOKIE = process.env.SESSION_COOKIE_NAME ?? "__session";

export async function GET() {
  try {
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return NextResponse.json({ user: null });

    const decoded = await adminAuth.verifySessionCookie(token, true);
    const d = decoded as Record<string, unknown>;
    const user = {
      uid: decoded.uid,
      email: typeof d.email === "string" ? d.email : undefined,
      displayName: (typeof d.displayName === "string" && d.displayName) || (typeof d.name === "string" ? d.name : undefined),
      picture: typeof d.picture === "string" ? d.picture : undefined,
    };
    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json({ user: null });
  }
}
