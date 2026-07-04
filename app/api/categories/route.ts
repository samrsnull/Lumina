import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth-server";
import {
  listCategories,
  createCategory,
  CategoryInput,
} from "@/lib/admin-categories";

export async function GET() {
  try {
    const categories = await listCategories();
    return NextResponse.json({ categories });
  } catch (e) {
    console.error("Error listando categorías:", e);
    return NextResponse.json(
      { error: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const user = await getServerUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

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

    const category = await createCategory(input);
    return NextResponse.json({ category }, { status: 201 });
  } catch (e) {
    console.error("Error creando categoría:", e);
    return NextResponse.json(
      { error: "Error al crear categoría" },
      { status: 500 }
    );
  }
}