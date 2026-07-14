"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BRAND } from "@/lib/constants";
import type { Product } from "@/lib/types";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "Ramos",
  promo: false,
  active: true,
};

const inputClass =
  "mt-2 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-brand";

export default function DashboardClient() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const me = await fetch("/api/auth/me", { cache: "no-store" });
    if (!me.ok) {
      router.replace("/login");
      return;
    }
    const res = await fetch("/api/products?all=1", { cache: "no-store" });
    if (!res.ok) {
      setError("No se pudieron cargar los productos");
      setReady(true);
      return;
    }
    setProducts(await res.json());
    setReady(true);
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      image: product.image,
      category: product.category,
      promo: product.promo,
      active: product.active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function onImageFileChange(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { compressImageForUpload } = await import("@/lib/compress-image");
      const compressed = await compressImageForUpload(file);
      const body = new FormData();
      body.append("file", compressed);
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.error ||
            `No se pudo subir la imagen (${res.status}). Revisa BLOB_READ_WRITE_TOKEN en Vercel.`,
        );
        return;
      }
      if (!data.url) {
        setError("La subida no devolvió URL de imagen");
        return;
      }
      setForm((prev) => ({ ...prev, image: data.url as string }));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al procesar/subir la imagen.";
      setError(message);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.image.trim()) {
      setError("Agrega una imagen (subida o URL)");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price) || 0,
      image: form.image.trim(),
      category: form.category,
      promo: form.promo,
      active: form.active,
    };

    try {
      const res = await fetch(
        editingId ? `/api/products/${editingId}` : "/api/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          cache: "no-store",
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "No se pudo guardar");
        return;
      }
      const saved = (await res.json()) as Product;
      if (editingId) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? saved : p)),
        );
      } else {
        setProducts((prev) => [saved, ...prev]);
      }
      resetForm();
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  async function togglePromo(product: Product) {
    const nextPromo = !product.promo;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, promo: nextPromo } : p,
      ),
    );
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promo: nextPromo }),
      cache: "no-store",
    });
    if (!res.ok) {
      setError("No se pudo actualizar la promoción");
      await load();
      return;
    }
    router.refresh();
  }

  async function removeProduct(id: string) {
    if (!confirm("¿Eliminar este producto del catálogo?")) return;

    const previous = products;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) resetForm();
    setError("");

    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: "DELETE",
        cache: "no-store",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setProducts(previous);
        setError(data.error || "No se pudo eliminar el producto");
        return;
      }
      router.refresh();
    } catch {
      setProducts(previous);
      setError("Error de conexión al eliminar");
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-soft text-muted">
        Cargando panel…
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-soft">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label={BRAND}>
              <Image
                src="/logo.png"
                alt={BRAND}
                width={160}
                height={48}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="hidden text-[11px] uppercase tracking-[0.16em] text-muted sm:block">
              Panel de productos
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="btn-pill !px-4 !py-2">
              Ver tienda
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="btn-pill !px-4 !py-2"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8 lg:py-12">
        <section className="border border-line bg-paper p-5 sm:p-6">
          <h1 className="font-display text-2xl text-ink">
            {editingId ? "Editar producto" : "Agregar producto"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Marca promoción para destacarlo en el catálogo.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-[11px] uppercase tracking-[0.14em] text-muted">
              Nombre
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block text-[11px] uppercase tracking-[0.14em] text-muted">
              Descripción
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className={inputClass}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-[11px] uppercase tracking-[0.14em] text-muted">
                Precio (L)
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className={inputClass}
                />
              </label>
              <label className="block text-[11px] uppercase tracking-[0.14em] text-muted">
                Categoría
                <input
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className={inputClass}
                />
              </label>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
                Imagen del producto
              </p>

              {form.image ? (
                <div className="relative aspect-square w-full max-w-[220px] overflow-hidden bg-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.image}
                    alt="Vista previa"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-square w-full max-w-[220px] items-center justify-center border border-dashed border-line bg-soft text-center text-xs text-muted">
                  Sin imagen
                </div>
              )}

              <label className="btn-pill inline-flex cursor-pointer !normal-case tracking-normal">
                {uploading ? "Comprimiendo y subiendo…" : "Subir foto (galería o cámara)"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={uploading || saving}
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    void onImageFileChange(file);
                    e.target.value = "";
                  }}
                />
              </label>
              <p className="text-xs text-muted">
                Se comprime en el dispositivo y se guarda en Vercel Blob (persistente).
              </p>

              <label className="block text-[11px] uppercase tracking-[0.14em] text-muted">
                O pegar URL de imagen
                <input
                  type="text"
                  inputMode="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://… o /uploads/…"
                  className={inputClass}
                />
              </label>
              {!form.image && (
                <p className="text-xs text-promo">
                  Sube una foto o indica una URL para continuar.
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-4 pt-1 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.promo}
                  onChange={(e) =>
                    setForm({ ...form, promo: e.target.checked })
                  }
                  className="accent-promo"
                />
                Marcar como promoción
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                  className="accent-brand"
                />
                Visible en la tienda
              </label>
            </div>

            {error && (
              <p className="text-sm text-promo" role="alert">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="submit"
                disabled={saving || uploading || !form.image.trim()}
                className="btn-pill disabled:opacity-60"
              >
                {saving
                  ? "Guardando…"
                  : editingId
                    ? "Guardar cambios"
                    : "Agregar producto"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-pill"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink">
            Catálogo ({products.length})
          </h2>
          {error && (
            <p className="mt-3 text-sm text-promo" role="alert">
              {error}
            </p>
          )}
          <ul className="mt-6 space-y-4">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex gap-4 border border-line bg-paper p-3 sm:p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-soft sm:h-24 sm:w-24">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-ink">{product.name}</p>
                      <p className="text-sm text-muted">
                        {product.category} · L{" "}
                        {product.price.toLocaleString("es-HN")}
                        {!product.active && " · Oculto"}
                      </p>
                    </div>
                    {product.promo && (
                      <span className="bg-promo px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                        Promo
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      className="text-[11px] uppercase tracking-[0.14em] text-brand hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => void togglePromo(product)}
                      className="text-[11px] uppercase tracking-[0.14em] text-muted hover:text-promo"
                    >
                      {product.promo ? "Quitar promo" : "Marcar promo"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeProduct(product.id)}
                      className="text-[11px] uppercase tracking-[0.14em] text-muted hover:text-promo"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
