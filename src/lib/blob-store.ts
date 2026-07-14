import { put, list, BlobAccessError } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { Product } from "./types";

const PRODUCTS_BLOB_KEY = "roselune/products.json";
const LEGACY_PATH = path.join(process.cwd(), "data", "products.json");

/**
 * Ready when we have a static RW token or a store id (OIDC on Vercel).
 */
export function hasBlobStore() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID,
  );
}

/** Must match how the Blob store was created (Public vs Private). */
function blobAccess(): "public" | "private" {
  return process.env.BLOB_ACCESS === "private" ? "private" : "public";
}

function blobAuthOptions(): { token?: string; storeId?: string } {
  // Prefer static RW token — most reliable
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return { token: process.env.BLOB_READ_WRITE_TOKEN };
  }
  // OIDC on Vercel: pair store id (VERCEL_OIDC_TOKEN is injected at runtime)
  if (process.env.BLOB_STORE_ID) {
    return { storeId: process.env.BLOB_STORE_ID };
  }
  return {};
}

function blobHelpError(cause?: unknown) {
  const base =
    "Vercel Blob rechazó el acceso. Haz esto: " +
    "1) Storage → tu Blob → debe ser Public (si es Private, créalo de nuevo como Public). " +
    "2) En Environment Variables debe existir BLOB_READ_WRITE_TOKEN " +
    "(mira Storage → Blob → pestaña del store / .env.local y cópialo). " +
    "3) Redeploy. BLOB_STORE_ID y BLOB_WEBHOOK_PUBLIC_KEY solos no siempre bastan.";
  if (cause instanceof Error && cause.message) {
    return `${base} Detalle: ${cause.message}`;
  }
  return base;
}

async function withBlobErrors<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof BlobAccessError) {
      throw new Error(blobHelpError(err));
    }
    throw err;
  }
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
  return withBlobErrors(async () => {
    const { blobs } = await list({
      prefix: PRODUCTS_BLOB_KEY,
      limit: 10,
      ...blobAuthOptions(),
    });
    const match = blobs.find((b) => b.pathname === PRODUCTS_BLOB_KEY);
    if (!match) return null;

    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return null;
    const parsed = (await res.json()) as Product[];
    return Array.isArray(parsed) ? parsed : [];
  });
}

async function writeToBlob(products: Product[]) {
  return withBlobErrors(async () => {
    const payload = `${JSON.stringify(products, null, 2)}\n`;
    await put(PRODUCTS_BLOB_KEY, payload, {
      access: blobAccess(),
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      ...blobAuthOptions(),
    });
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
    throw new Error(blobHelpError());
  }

  await writeToLocal(products);
}

export async function uploadProductImage(
  file: Blob,
  filename: string,
): Promise<string> {
  if (!hasBlobStore()) {
    if (process.env.VERCEL) {
      throw new Error(blobHelpError());
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
    await fs.writeFile(path.join(uploadDir, safe), buffer);
    return `/uploads/${safe}`;
  }

  return withBlobErrors(async () => {
    const blob = await put(`roselune/uploads/${filename}`, file, {
      access: blobAccess(),
      contentType: file.type || "image/jpeg",
      addRandomSuffix: true,
      ...blobAuthOptions(),
    });
    return blob.url;
  });
}
