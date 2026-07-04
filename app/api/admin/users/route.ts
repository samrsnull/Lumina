import { NextResponse } from "next/server";
import { listAuthUsers } from "@/lib/admin-users";
import { getServerUser } from "@/lib/auth-server";

// GET /api/admin/users
export async function GET() {
  // Opcional pero recomendable: validar que haya sesión
  const user = await getServerUser();
  if (!user) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const users = await listAuthUsers(50); // límite de ejemplo
    return NextResponse.json({ users });
  } catch (e: unknown) {
    console.error("Error listando usuarios:", e);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}
