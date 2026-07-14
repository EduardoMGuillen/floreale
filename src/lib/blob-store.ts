import { put, list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { Product } from "./types";

const PRODUCTS_BLOB_KEY = "roselune/products.json";
const LEGACY_PATH = path.join(process.cwd(), "data", "products.json");

export function hasBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readSeed(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(LEGACY_PATH, "utf8");
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function readFromLocal(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(LEGACY_PATH, "utf8");
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeToLocal(products: Product[]) {
  const payload = `${JSON.stringify(products, null, 2)}\n`;
  await fs.mkdir(path.dirname(LEGACY_PATH), { recursive: true });
  await fs.writeFile(LEGACY_PATH, payload, "utf8");
}

async function readFromBlob(): Promise<Product[] | null> {
  const { blobs } = await list({ prefix: PRODUCTS_BLOB_KEY, limit: 10 });
  const match = blobs.find((b) => b.pathname === PRODUCTS_BLOB_KEY);
  if (!match) return null;

  const res = await fetch(match.url, { cache: "no-store" });
  if (!res.ok) return null;
  const parsed = (await res.json()) as Product[];
  return Array.isArray(parsed) ? parsed : [];
}

async function writeToBlob(products: Product[]) {
  const payload = `${JSON.stringify(products, null, 2)}\n`;
  await put(PRODUCTS_BLOB_KEY, payload, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

/** Read catalog — Vercel Blob in production, local JSON in development. */
export async function loadProducts(): Promise<Product[]> {
  if (hasBlobStore()) {
    const fromBlob = await readFromBlob();
    if (fromBlob) return fromBlob;
    const seed = await readSeed();
    await writeToBlob(seed);
    return seed;
  }
  return readFromLocal();
}

/** Persist catalog — requires Blob on Vercel (filesystem is ephemeral there). */
export async function saveProducts(products: Product[]) {
  if (hasBlobStore()) {
    await writeToBlob(products);
    return;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Falta BLOB_READ_WRITE_TOKEN en Vercel. Activa Blob Storage y agrega el token para poder guardar/eliminar productos.",
    );
  }

  await writeToLocal(products);
}

export async function uploadProductImage(
  file: Blob,
  filename: string,
): Promise<string> {
  if (!hasBlobStore()) {
    if (process.env.VERCEL) {
      throw new Error(
        "Falta BLOB_READ_WRITE_TOKEN en Vercel para subir imágenes.",
      );
    }
    // Local fallback: write under public/uploads
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
    await fs.writeFile(path.join(uploadDir, safe), buffer);
    return `/uploads/${safe}`;
  }

  const blob = await put(`roselune/uploads/${filename}`, file, {
    access: "public",
    contentType: file.type || "image/jpeg",
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return blob.url;
}
