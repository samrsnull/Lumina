import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth-server";
import {
  updateCategory,
  deleteCategory,
  CategoryInput,
} from "@/lib/admin-categories";

type RouteParams = {
  params: { id: string };
};

export async function PUT(req: Request, { params }: RouteParams) {
  const user = await getServerUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = params;

  try {
    const body = (await req.json()) as Partial<CategoryInput>;
    if (!body.name) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const input: CategoryInput = {
      name: body.name,
      description: body.description ?? "",
      color: body.color ?? "#22c55e",
    };

    const category = await updateCategory(id, input);
    return NextResponse.json({ category });
  } catch (e) {
    console.error("Error actualizando categoría:", e);
    return NextResponse.json(
      { error: "Error al actualizar categoría" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const user = await getServerUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = params;

  try {
    await deleteCategory(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Error eliminando categoría:", e);
    return NextResponse.json(
      { error: "Error al eliminar categoría" },
      { status: 500 }
    );
  }
}