import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createProduct, getProducts } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "1";
  if (all) {
    const ok = await isAuthenticated();
    if (!ok) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }
  const products = await getProducts({ includeInactive: all });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const ok = await isAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.image) {
    return NextResponse.json(
      { error: "Nombre e imagen son obligatorios" },
      { status: 400 },
    );
  }

  const product = await createProduct({
    name: body.name,
    description: body.description || "",
    price: body.price ?? 0,
    image: body.image,
    category: body.category || "General",
    promo: Boolean(body.promo),
    active: body.active !== false,
  });

  return NextResponse.json(product, { status: 201 });
}
