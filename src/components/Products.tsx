"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { whatsappBuyUrl } from "@/lib/whatsapp";

function formatPrice(price: number) {
  return `L ${price.toLocaleString("es-HN")}`;
}

export default function Products({ products }: { products: Product[] }) {
  const visible = products.filter((p) => p.active);

  return (
    <section id="arreglos" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-sage">
            Catálogo
          </p>
          <h2 className="mt-3 font-display text-3xl text-leaf-deep sm:text-4xl">
            Arreglos y productos
          </h2>
          <p className="mt-3 text-muted">
            Elige tu favorito y solicita el pedido directo por WhatsApp.
          </p>
        </motion.div>

        {visible.length === 0 ? (
          <p className="mt-12 text-muted">Pronto habrá nuevos arreglos disponibles.</p>
        ) : (
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product, index) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="group"
              >
                <Link href={`/producto/${product.id}`} className="block overflow-hidden">
                  <div className="relative aspect-[4/5] overflow-hidden bg-mist">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    {product.promo && (
                      <span className="absolute left-3 top-3 bg-petal px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-white">
                        Promoción
                      </span>
                    )}
                  </div>
                </Link>
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider text-sage">
                    {product.category}
                  </p>
                  <Link
                    href={`/producto/${product.id}`}
                    className="mt-1 block font-display text-xl text-leaf-deep transition hover:text-leaf"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="font-medium text-ink">{formatPrice(product.price)}</p>
                    <a
                      href={whatsappBuyUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md bg-leaf px-3.5 py-2 text-sm font-medium text-white transition hover:bg-leaf-deep"
                    >
                      Comprar
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
