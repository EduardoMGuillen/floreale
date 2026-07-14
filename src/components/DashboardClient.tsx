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

export default function DashboardPage() {
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
      <div className="botanical-wash flex min-h-[100svh] items-center justify-center text-muted">
        Cargando panel…
      </div>
    );
  }

  return (
    <div className="botanical-wash min-h-[100svh]">
      <header className="border-b border-leaf/10 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <Link href="/" className="font-display text-2xl text-leaf-deep">
              {BRAND}
            </Link>
            <p className="text-sm text-muted">Panel de productos</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="rounded-md border border-leaf/20 px-3 py-2 text-sm text-leaf hover:bg-mist"
            >
              Ver tienda
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-md bg-leaf px-3 py-2 text-sm font-medium text-white hover:bg-leaf-deep"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8 lg:py-12">
        <section className="border border-leaf/15 bg-paper/80 p-5 sm:p-6">
          <h1 className="font-display text-2xl text-leaf-deep">
            {editingId ? "Editar producto" : "Agregar producto"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Marca promoción para destacarlo en el catálogo.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-sm">
              Nombre
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1.5 w-full rounded-md border border-leaf/20 bg-white px-3 py-2 text-sm outline-none ring-leaf/30 focus:ring-2 dark:bg-leaf-deep/30"
              />
            </label>
            <label className="block text-sm">
              Descripción
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="mt-1.5 w-full rounded-md border border-leaf/20 bg-white px-3 py-2 text-sm outline-none ring-leaf/30 focus:ring-2 dark:bg-leaf-deep/30"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                Precio (L)
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="mt-1.5 w-full rounded-md border border-leaf/20 bg-white px-3 py-2 text-sm outline-none ring-leaf/30 focus:ring-2 dark:bg-leaf-deep/30"
                />
              </label>
              <label className="block text-sm">
                Categoría
                <input
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-md border border-leaf/20 bg-white px-3 py-2 text-sm outline-none ring-leaf/30 focus:ring-2 dark:bg-leaf-deep/30"
                />
              </label>
            </div>
            <label className="block text-sm">
              URL de imagen
              <input
                required
                type="url"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="mt-1.5 w-full rounded-md border border-leaf/20 bg-white px-3 py-2 text-sm outline-none ring-leaf/30 focus:ring-2 dark:bg-leaf-deep/30"
              />
            </label>
            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.promo}
                  onChange={(e) =>
                    setForm({ ...form, promo: e.target.checked })
                  }
                  className="accent-petal"
                />
                Marcar como promoción
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                  className="accent-leaf"
                />
                Visible en la tienda
              </label>
            </div>

            {error && (
              <p className="text-sm text-petal" role="alert">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-leaf px-4 py-2.5 text-sm font-medium text-white hover:bg-leaf-deep disabled:opacity-60"
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
                  className="rounded-md border border-leaf/20 px-4 py-2.5 text-sm text-muted hover:bg-mist"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <h2 className="font-display text-2xl text-leaf-deep">
            Catálogo ({products.length})
          </h2>
          <ul className="mt-6 space-y-4">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex gap-4 border border-leaf/15 bg-paper/70 p-3 sm:p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-mist sm:h-24 sm:w-24">
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
                      <span className="bg-petal px-2 py-0.5 text-xs font-medium text-white">
                        Promo
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      className="text-xs font-medium text-leaf hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => void togglePromo(product)}
                      className="text-xs font-medium text-petal hover:underline"
                    >
                      {product.promo ? "Quitar promo" : "Marcar promo"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeProduct(product.id)}
                      className="text-xs font-medium text-muted hover:text-petal hover:underline"
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
