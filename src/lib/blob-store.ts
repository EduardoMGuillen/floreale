import {
  put,
  head,
  BlobAccessError,
  BlobNotFoundError,
} from "@vercel/blob";
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
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return { token: process.env.BLOB_READ_WRITE_TOKEN };
  }
  if (process.env.BLOB_STORE_ID) {
    return { storeId: process.env.BLOB_STORE_ID };
  }
  return {};
}

function blobHelpError(cause?: unknown) {
  const base =
    "Vercel Blob rechazó el acceso. Haz esto: " +
    "1) Storage → tu Blob → debe ser Public. " +
    "2) Agrega BLOB_READ_WRITE_TOKEN en Environment Variables. " +
    "3) Redeploy.";
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

type BlobRead =
  | { status: "ok"; products: Product[] }
  | { status: "missing" };

/**
 * Read catalog from Blob.
 * - ok + products (may be empty []) = real catalog, never re-seed
 * - missing = file never created → allow one-time seed
 * - throws on access/network errors (do NOT seed)
 */
async function readFromBlob(): Promise<BlobRead> {
  return withBlobErrors(async () => {
    try {
      const meta = await head(PRODUCTS_BLOB_KEY, blobAuthOptions());
      const res = await fetch(meta.url, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`No se pudo leer el catálogo (${res.status})`);
      }
      const parsed = (await res.json()) as Product[];
      return {
        status: "ok",
        products: Array.isArray(parsed) ? parsed : [],
      };
    } catch (err) {
      if (err instanceof BlobNotFoundError) {
        return { status: "missing" };
      }
      // Some SDK versions throw generic errors for 404
      const msg = err instanceof Error ? err.message.toLowerCase() : "";
      if (
        msg.includes("not found") ||
        msg.includes("does not exist") ||
        msg.includes("404")
      ) {
        return { status: "missing" };
      }
      throw err;
    }
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
    const result = await readFromBlob();
    if (result.status === "ok") {
      // Empty catalog is valid (user deleted everything) — NEVER re-seed
      return result.products;
    }
    // Truly first run: seed once from demo JSON
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
