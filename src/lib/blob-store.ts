import {
  put,
  get,
  BlobAccessError,
  BlobNotFoundError,
} from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { Product } from "./types";

const PRODUCTS_BLOB_KEY = "roselune/products.json";
const LEGACY_PATH = path.join(process.cwd(), "data", "products.json");

export function hasBlobStore() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID,
  );
}

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
    "Vercel Blob rechazó el acceso. Revisa BLOB_READ_WRITE_TOKEN, Blob Public y Redeploy.";
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

function isNotFound(err: unknown) {
  if (err instanceof BlobNotFoundError) return true;
  const msg = err instanceof Error ? err.message.toLowerCase() : "";
  return (
    msg.includes("not found") ||
    msg.includes("does not exist") ||
    msg.includes("404")
  );
}

async function streamToText(stream: ReadableStream<Uint8Array>) {
  return new Response(stream).text();
}

/**
 * Read via authenticated get() — more reliable than public fetch(url),
 * which often fails with private stores or CDN auth errors.
 */
async function readFromBlob(): Promise<BlobRead> {
  return withBlobErrors(async () => {
    try {
      const result = await get(PRODUCTS_BLOB_KEY, {
        access: blobAccess(),
        useCache: false,
        ...blobAuthOptions(),
      });

      if (!result) {
        return { status: "missing" };
      }

      if (result.statusCode !== 200 || !result.stream) {
        throw new Error(
          `No se pudo leer el catálogo (status ${result.statusCode})`,
        );
      }

      const text = await streamToText(result.stream);
      const parsed = JSON.parse(text) as Product[];
      return {
        status: "ok",
        products: Array.isArray(parsed) ? parsed : [],
      };
    } catch (err) {
      if (isNotFound(err)) return { status: "missing" };

      // Fallback: try the opposite access mode once (Public vs Private mismatch)
      try {
        const other = blobAccess() === "public" ? "private" : "public";
        const result = await get(PRODUCTS_BLOB_KEY, {
          access: other,
          useCache: false,
          ...blobAuthOptions(),
        });
        if (!result) return { status: "missing" };
        if (result.statusCode !== 200 || !result.stream) throw err;
        const text = await streamToText(result.stream);
        const parsed = JSON.parse(text) as Product[];
        return {
          status: "ok",
          products: Array.isArray(parsed) ? parsed : [],
        };
      } catch (err2) {
        if (isNotFound(err2)) return { status: "missing" };
        throw err;
      }
    }
  });
}

async function writeToBlob(products: Product[]) {
  return withBlobErrors(async () => {
    const payload = `${JSON.stringify(products, null, 2)}\n`;
    // Try configured access; if Access denied, retry with the other mode
    try {
      await put(PRODUCTS_BLOB_KEY, payload, {
        access: blobAccess(),
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
        ...blobAuthOptions(),
      });
    } catch (err) {
      if (!(err instanceof BlobAccessError)) throw err;
      const other = blobAccess() === "public" ? "private" : "public";
      await put(PRODUCTS_BLOB_KEY, payload, {
        access: other,
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
        ...blobAuthOptions(),
      });
    }
  });
}

export async function loadProducts(): Promise<Product[]> {
  if (hasBlobStore()) {
    const result = await readFromBlob();
    if (result.status === "ok") {
      return result.products;
    }
    const seed = await readSeed();
    await writeToBlob(seed);
    return seed;
  }
  return readFromLocal();
}

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
    try {
      const blob = await put(`roselune/uploads/${filename}`, file, {
        access: blobAccess(),
        contentType: file.type || "image/jpeg",
        addRandomSuffix: true,
        ...blobAuthOptions(),
      });
      return blob.url;
    } catch (err) {
      if (!(err instanceof BlobAccessError)) throw err;
      const other = blobAccess() === "public" ? "private" : "public";
      const blob = await put(`roselune/uploads/${filename}`, file, {
        access: other,
        contentType: file.type || "image/jpeg",
        addRandomSuffix: true,
        ...blobAuthOptions(),
      });
      return blob.url;
    }
  });
}
