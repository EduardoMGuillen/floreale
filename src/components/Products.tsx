"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CATALOG_FILTERS } from "@/lib/constants";
import type { Product } from "@/lib/types";
import { whatsappBuyUrl } from "@/lib/whatsapp";

function formatPrice(price: number) {
  return `L ${price.toLocaleString("es-HN")}`;
}

function matchesFilter(product: Product, filter: string) {
  if (filter === "all") return true;
  if (filter === "Rosas") {
    return (
      product.category.toLowerCase().includes("rosa") ||
      product.name.toLowerCase().includes("rosa") ||
      product.name.toLowerCase().includes("romance")
    );
  }
  return product.category === filter;
}

export default function Products({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState("all");
  const visible = useMemo(
    () => products.filter((p) => p.active && matchesFilter(p, filter)),
    [products, filter],
  );

  return (
    <section id="catalogo" className="scroll-mt-24 bg-paper px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center font-display text-3xl text-ink sm:text-4xl"
        >
          Ramos de flores
        </motion.h2>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-[11px] uppercase tracking-[0.14em] text-muted">
          {CATALOG_FILTERS.map((item, index) => (
            <span key={item.id} className="inline-flex items-center">
              {index > 0 && <span className="mx-2 hidden text-line sm:inline">|</span>}
              <button
                type="button"
                onClick={() => setFilter(item.id)}
                className={`px-2 py-1 transition ${
                  filter === item.id
                    ? "text-brand"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            </span>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="mt-16 text-center text-sm text-muted">
            No hay productos en esta categoría.
          </p>
        ) : (
          <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {visible.map((product, index) => {
              const tall = index % 5 === 0 || index % 5 === 3;
              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: (index % 3) * 0.05 }}
                  className="mb-8 break-inside-avoid"
                >
                  <Link href={`/producto/${product.id}`} className="group block">
                    <div
                      className={`relative overflow-hidden bg-soft ${
                        tall ? "aspect-[3/4]" : "aspect-square"
                      }`}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                      {product.promo && (
                        <span className="absolute left-3 top-3 bg-promo px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                          Promo
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="mt-3 flex items-baseline justify-between gap-3">
                    <Link
                      href={`/producto/${product.id}`}
                      className="font-display text-base text-ink transition hover:text-brand sm:text-lg"
                    >
                      {product.name}
                    </Link>
                    <p className="shrink-0 text-sm text-ink/80">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <a
                    href={whatsappBuyUrl(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-[10px] font-medium uppercase tracking-[0.18em] text-brand transition hover:text-brand-deep"
                  >
                    Comprar →
                  </a>
                </motion.article>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <a href="#catalogo" className="btn-pill">
            Ver todo
          </a>
        </div>
      </div>
    </section>
  );
}
