import { promises as fs } from "fs";
import path from "path";
import type { Product, ProductInput } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "products.json");

async function readAll(): Promise<Product[]> {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw) as Product[];
}

async function writeAll(products: Product[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2), "utf8");
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export async function getProducts(opts?: { includeInactive?: boolean }) {
  const products = await readAll();
  if (opts?.includeInactive) return products;
  return products.filter((p) => p.active);
}

export async function getProductById(id: string) {
  const products = await readAll();
  return products.find((p) => p.id === id) ?? null;
}

export async function createProduct(input: ProductInput) {
  const products = await readAll();
  const base = input.id || slugify(input.name) || `producto-${Date.now()}`;
  let id = base;
  let i = 1;
  while (products.some((p) => p.id === id)) {
    id = `${base}-${i++}`;
  }
  const product: Product = {
    id,
    name: input.name.trim(),
    description: input.description.trim(),
    price: Number(input.price) || 0,
    image: input.image.trim(),
    category: input.category.trim() || "General",
    promo: Boolean(input.promo),
    active: input.active !== false,
    createdAt: new Date().toISOString(),
  };
  products.unshift(product);
  await writeAll(products);
  return product;
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const products = await readAll();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const current = products[idx];
  products[idx] = {
    ...current,
    name: input.name?.trim() ?? current.name,
    description: input.description?.trim() ?? current.description,
    price:
      input.price !== undefined ? Number(input.price) || 0 : current.price,
    image: input.image?.trim() ?? current.image,
    category: input.category?.trim() ?? current.category,
    promo: input.promo !== undefined ? Boolean(input.promo) : current.promo,
    active: input.active !== undefined ? Boolean(input.active) : current.active,
  };
  await writeAll(products);
  return products[idx];
}

export async function deleteProduct(id: string) {
  const products = await readAll();
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) return false;
  await writeAll(next);
  return true;
}
