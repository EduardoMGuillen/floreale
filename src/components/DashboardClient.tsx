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

type BusyState = {
  label: string;
} | null;

export default function DashboardClient() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<BusyState>(null);
  const [uploading, setUploading] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const locked = Boolean(busy) || uploading;

  const fetchAllProducts = useCallback(async () => {
    const res = await fetch("/api/products?all=1", { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo verificar el catálogo");
    return (await res.json()) as Product[];
  }, []);

  /** Keep overlay until Blob/API actually reflects the expected catalog state. */
  const waitUntilReflected = useCallback(
    async (
      assert: (list: Product[]) => boolean,
      confirmingLabel: string,
    ) => {
      setBusy({ label: confirmingLabel });
      for (let attempt = 0; attempt < 10; attempt++) {
        try {
          const list = await fetchAllProducts();
          if (assert(list)) {
            setProducts(list);
            router.refresh();
            return true;
          }
        } catch {
          // retry — never treat a failed read as “missing catalog”
        }
        await new Promise((r) => setTimeout(r, 350 + attempt * 150));
      }
      // Do NOT overwrite local list with a failed / stale fetch
      // (that used to re-introduce deleted seed products)
      router.refresh();
      return false;
    },
    [fetchAllProducts, router],
  );

  const load = useCallback(async () => {
    const me = await fetch("/api/auth/me", { cache: "no-store" });
    if (!me.ok) {
      router.replace("/login");
      return;
    }
    try {
      const list = await fetchAllProducts();
      setProducts(list);
    } catch {
      setError("No se pudieron cargar los productos");
    }
    setReady(true);
  }, [router, fetchAllProducts]);

  useEffect(() => {
    void load();
  }, [load]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }

  function startEdit(product: Product) {
    if (locked) return;
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
    if (!file || locked) return;
    setUploading(true);
    setBusy({ label: "Subiendo imagen… Espera, no recargues la página." });
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
            `No se pudo subir la imagen (${res.status}). Revisa Blob en Vercel.`,
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
      setBusy(null);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (locked) return;
    if (!form.image.trim()) {
      setError("Agrega una imagen (subida o URL)");
      return;
    }
    const wasEditing = Boolean(editingId);
    const editId = editingId;
    setBusy({
      label: wasEditing
        ? "Guardando producto… No recargues."
        : "Creando producto… No recargues (puede tardar unos segundos).",
    });
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
        editId ? `/api/products/${editId}` : "/api/products",
        {
          method: editId ? "PATCH" : "POST",
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
      setBusy({
        label: "Confirmando en el servidor… Espera a que se refleje.",
      });
      const ok = await waitUntilReflected(
        (list) => {
          const found = list.find((p) => p.id === saved.id);
          if (!found) return false;
          return (
            found.name === saved.name &&
            found.active === saved.active &&
            found.promo === saved.promo &&
            found.image === saved.image
          );
        },
        "Confirmando creación/guardado… Aún no recargues.",
      );
      if (!ok) {
        setError(
          "Se guardó, pero tardó en confirmarse. Revisa el catálogo antes de volver a crear.",
        );
      }
      resetForm();
    } catch {
      setError("Error de conexión");
    } finally {
      setBusy(null);
    }
  }

  async function togglePromo(product: Product) {
    if (locked) return;
    const nextPromo = !product.promo;
    setPendingId(product.id);
    setBusy({
      label: nextPromo
        ? "Marcando promoción… No recargues."
        : "Quitando promoción… No recargues.",
    });
    const previous = products;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, promo: nextPromo } : p,
      ),
    );
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promo: nextPromo }),
        cache: "no-store",
      });
      if (!res.ok) {
        setProducts(previous);
        setError("No se pudo actualizar la promoción");
        return;
      }
      const ok = await waitUntilReflected(
        (list) => list.some((p) => p.id === product.id && p.promo === nextPromo),
        "Confirmando promoción… Espera.",
      );
      if (!ok) {
        setError("El cambio de promo tarda en reflejarse. Revisa antes de repetir.");
      }
    } catch {
      setProducts(previous);
      setError("Error de conexión");
    } finally {
      setPendingId(null);
      setBusy(null);
    }
  }

  async function toggleVisibility(product: Product) {
    if (locked) return;
    const nextActive = !product.active;
    setPendingId(product.id);
    setBusy({
      label: nextActive
        ? "Mostrando en la tienda… No recargues."
        : "Ocultando de la tienda… No recargues.",
    });
    const previous = products;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, active: nextActive } : p,
      ),
    );
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: nextActive }),
        cache: "no-store",
      });
      if (!res.ok) {
        setProducts(previous);
        setError("No se pudo cambiar la visibilidad");
        return;
      }
      const ok = await waitUntilReflected(
        (list) =>
          list.some((p) => p.id === product.id && p.active === nextActive),
        nextActive
          ? "Confirmando que ya está visible… Espera."
          : "Confirmando que ya está oculto… Espera.",
      );
      if (!ok) {
        setError(
          "La visibilidad tarda en reflejarse. Revisa la tienda antes de repetir.",
        );
      }
    } catch {
      setProducts(previous);
      setError("Error de conexión");
    } finally {
      setPendingId(null);
      setBusy(null);
    }
  }

  async function removeProduct(id: string) {
    if (locked) return;
    if (!confirm("¿Eliminar este producto del catálogo?")) return;

    setPendingId(id);
    setBusy({
      label: "Eliminando producto… No recargues hasta que termine.",
    });
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
      const ok = await waitUntilReflected(
        (list) => !list.some((p) => p.id === id),
        "Confirmando eliminación… Espera a que desaparezca del catálogo.",
      );
      if (!ok) {
        setError(
          "La eliminación tarda en confirmarse. Revisa el catálogo antes de volver a crear el mismo producto.",
        );
      }
    } catch {
      setProducts(previous);
      setError("Error de conexión al eliminar");
    } finally {
      setPendingId(null);
      setBusy(null);
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center text-muted">
        <div className="flex flex-col items-center gap-4">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p>Cargando panel…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100svh] bg-soft">
      {busy && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/45 px-6 backdrop-blur-[2px]"
          role="alertdialog"
          aria-busy="true"
          aria-live="assertive"
        >
          <div className="w-full max-w-sm border border-line bg-paper px-6 py-8 text-center shadow-lg">
            <span className="mx-auto mb-5 block h-10 w-10 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            <p className="font-display text-xl text-ink">Espera…</p>
            <p className="mt-2 text-sm text-muted">{busy.label}</p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-muted">
              El loading cierra solo cuando el cambio ya está confirmado
            </p>
          </div>
        </div>
      )}

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
              disabled={locked}
              className="btn-pill !px-4 !py-2 disabled:opacity-50"
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
            Guardar en Vercel puede tardar unos segundos. Espera la confirmación.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-[11px] uppercase tracking-[0.14em] text-muted">
              Nombre
              <input
                required
                disabled={locked}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block text-[11px] uppercase tracking-[0.14em] text-muted">
              Descripción
              <textarea
                required
                disabled={locked}
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
                  disabled={locked}
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
                  disabled={locked}
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

              <label
                className={`btn-pill inline-flex !normal-case tracking-normal ${locked ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
              >
                {uploading ? "Subiendo…" : "Subir foto (galería o cámara)"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={locked}
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    void onImageFileChange(file);
                    e.target.value = "";
                  }}
                />
              </label>
              <p className="text-xs text-muted">
                Se comprime y se guarda en Vercel Blob.
              </p>

              <label className="block text-[11px] uppercase tracking-[0.14em] text-muted">
                O pegar URL de imagen
                <input
                  type="text"
                  disabled={locked}
                  inputMode="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://…"
                  className={inputClass}
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-4 pt-1 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  disabled={locked}
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
                  disabled={locked}
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
                disabled={locked || !form.image.trim()}
                className="btn-pill disabled:opacity-60"
              >
                {editingId ? "Guardar cambios" : "Agregar producto"}
              </button>
              {editingId && (
                <button
                  type="button"
                  disabled={locked}
                  onClick={resetForm}
                  className="btn-pill disabled:opacity-50"
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
            {products.map((product) => {
              const rowBusy = pendingId === product.id;
              return (
                <li
                  key={product.id}
                  className={`flex gap-4 border border-line bg-paper p-3 sm:p-4 ${
                    !product.active ? "opacity-70" : ""
                  } ${rowBusy ? "ring-1 ring-brand/40" : ""}`}
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
                      <div className="flex flex-wrap gap-1">
                        {product.promo && (
                          <span className="bg-promo px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                            Promo
                          </span>
                        )}
                        {!product.active && (
                          <span className="bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                            Oculto
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={locked}
                        onClick={() => startEdit(product)}
                        className="text-[11px] uppercase tracking-[0.14em] text-brand hover:underline disabled:opacity-40"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={locked}
                        onClick={() => void togglePromo(product)}
                        className="text-[11px] uppercase tracking-[0.14em] text-muted hover:text-promo disabled:opacity-40"
                      >
                        {product.promo ? "Quitar promo" : "Marcar promo"}
                      </button>
                      <button
                        type="button"
                        disabled={locked}
                        onClick={() => void toggleVisibility(product)}
                        className="text-[11px] uppercase tracking-[0.14em] text-muted hover:text-brand disabled:opacity-40"
                      >
                        {product.active ? "Ocultar" : "Mostrar"}
                      </button>
                      <button
                        type="button"
                        disabled={locked}
                        onClick={() => void removeProduct(product.id)}
                        className="text-[11px] uppercase tracking-[0.14em] text-muted hover:text-promo disabled:opacity-40"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
