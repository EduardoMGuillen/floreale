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

  const load = useCallback(async () => {
    const me = await fetch("/api/auth/me");
    if (!me.ok) {
      router.replace("/login");
      return;
    }
    const res = await fetch("/api/products?all=1");
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

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price) || 0,
      image: form.image,
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
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "No se pudo guardar");
        return;
      }
      resetForm();
      await load();
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  async function togglePromo(product: Product) {
    await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promo: !product.promo }),
    });
    await load();
  }

  async function removeProduct(id: string) {
    if (!confirm("¿Eliminar este producto del catálogo?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (editingId === id) resetForm();
    await load();
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
            <label className="block text-[11px] uppercase tracking-[0.14em] text-muted">
              URL de imagen
              <input
                required
                type="url"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className={inputClass}
              />
            </label>
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
                disabled={saving}
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
          <ul className="mt-6 space-y-4">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex gap-4 border border-line bg-paper p-3 sm:p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-soft sm:h-24 sm:w-24">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
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
