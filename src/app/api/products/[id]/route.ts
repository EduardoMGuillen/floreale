import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/lib/products";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product || !product.active) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  return NextResponse.json(product, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PATCH(request: Request, { params }: Params) {
  const ok = await isAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  try {
    const product = await updateProduct(id, body);
    if (!product) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    return NextResponse.json(product, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("PATCH product", err);
    return NextResponse.json(
      { error: "No se pudo guardar el cambio en el catálogo" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const ok = await isAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const deleted = await deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("DELETE product", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "No se pudo eliminar. En Vercel necesitas BLOB_READ_WRITE_TOKEN.",
      },
      { status: 500 },
    );
  }
}
