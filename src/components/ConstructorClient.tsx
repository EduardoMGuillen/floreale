"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { BRAND, WHATSAPP_NUMBER } from "@/lib/constants";
import { productPageUrl } from "@/lib/whatsapp";
import type { Product } from "@/lib/types";

type Props = { products: Product[] };

export default function ConstructorClient({ products }: Props) {
  const active = products.filter((p) => p.active);
  const [selectedId, setSelectedId] = useState(active[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [bouquet, setBouquet] = useState<{ product: Product; qty: number }[]>(
    [],
  );
  const [page, setPage] = useState(0);
  const perPage = 6;

  const selected = active.find((p) => p.id === selectedId) ?? active[0];
  const pages = Math.max(1, Math.ceil(active.length / perPage));
  const pageItems = active.slice(page * perPage, page * perPage + perPage);

  const total = useMemo(
    () => bouquet.reduce((sum, item) => sum + item.product.price * item.qty, 0),
    [bouquet],
  );

  function addToBouquet() {
    if (!selected) return;
    setBouquet((prev) => {
      const existing = prev.find((i) => i.product.id === selected.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === selected.id
            ? { ...i, qty: i.qty + qty }
            : i,
        );
      }
      return [...prev, { product: selected, qty }];
    });
    setQty(1);
  }

  function checkout() {
    if (bouquet.length === 0 && selected) {
      const link = productPageUrl(selected.id);
      const message = `Hola ${BRAND} 🌿\n\nQuiero armar un ramo personalizado:\n• ${selected.name} x${qty}\n\nEnlace: ${link}\n\n¿Me confirman disponibilidad?`;
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }

    const lines = bouquet
      .map((i) => `• ${i.product.name} x${i.qty}`)
      .join("\n");
    const links = bouquet
      .map((i) => productPageUrl(i.product.id))
      .join("\n");
    const message = `Hola ${BRAND} 🌿\n\nQuiero este ramo personalizado:\n${lines}\n\nTotal estimado: L ${total.toLocaleString("es-HN")}\n\nEnlaces:\n${links}\n\n¿Me confirman disponibilidad y entrega?`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  if (!selected) {
    return (
      <p className="py-20 text-center text-muted">
        Agrega productos en el panel para usar el constructor.
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="text-center text-sm font-medium uppercase tracking-[0.28em] text-ink">
        Constructor de ramo
      </h1>

      <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr_0.9fr] lg:items-start">
        <div>
          <div className="grid grid-cols-2 gap-4">
            {pageItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`text-left transition ${
                  selected.id === item.id ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-soft">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <div className="mt-2 flex justify-between gap-2 text-xs">
                  <span>{item.name}</span>
                  <span>L {item.price.toLocaleString("es-HN")}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Anterior"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="text-lg text-ink disabled:opacity-30"
            >
              ‹
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Página ${i + 1}`}
                  onClick={() => setPage(i)}
                  className={`h-1.5 w-1.5 rounded-full ${
                    i === page ? "bg-ink" : "bg-line"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Siguiente"
              disabled={page >= pages - 1}
              onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
              className="text-lg text-ink disabled:opacity-30"
            >
              ›
            </button>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden bg-soft">
          <Image
            src={selected.image}
            alt={selected.name}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            priority
          />
        </div>

        <div>
          <div className="flex gap-3">
            {[selected.image, selected.image].map((src, i) => (
              <div key={i} className="relative h-16 w-16 overflow-hidden bg-soft">
                <Image src={src} alt="" fill sizes="64px" className="object-cover" />
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            {selected.description}
          </p>

          <div className="mt-8 flex items-center gap-3 text-sm">
            <span>Cantidad:</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-2 text-lg leading-none"
            >
              ‹
            </button>
            <span className="min-w-6 text-center">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="px-2 text-lg leading-none"
            >
              ›
            </button>
          </div>

          <button type="button" onClick={addToBouquet} className="btn-pill mt-6">
            Agregar al ramo
          </button>

          <div className="mt-12 border-t border-line pt-6">
            <details className="group">
              <summary className="cursor-pointer list-none text-sm text-muted">
                Ver tu ramo{" "}
                <span className="inline-block transition group-open:rotate-180">
                  ⌄
                </span>
              </summary>
              <ul className="mt-3 space-y-2 text-sm">
                {bouquet.length === 0 ? (
                  <li className="text-muted">Aún vacío</li>
                ) : (
                  bouquet.map((item) => (
                    <li
                      key={item.product.id}
                      className="flex justify-between gap-3"
                    >
                      <span>
                        {item.product.name} ×{item.qty}
                      </span>
                      <span>
                        L{" "}
                        {(item.product.price * item.qty).toLocaleString("es-HN")}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </details>
            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-sm">
                Total:{" "}
                <span className="font-medium">
                  L{" "}
                  {(bouquet.length ? total : selected.price * qty).toLocaleString(
                    "es-HN",
                  )}
                </span>
              </p>
              <button
                type="button"
                onClick={checkout}
                className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition hover:text-brand"
              >
                Checkout ——→
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
