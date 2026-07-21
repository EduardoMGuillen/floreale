"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { demoImages } from "@/lib/demo-images";

const points = [
  "Flores frescas de temporada, seleccionadas a diario",
  "Diseño a medida para eventos, regalos y espacios",
  "Entrega a domicilio en El Progreso, Yoro y San Pedro Sula",
];

export default function About() {
  return (
    <section id="sobre" className="scroll-mt-24 border-t border-line bg-soft/60 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative aspect-square overflow-hidden bg-blush"
        >
          <Image
            src={demoImages.about}
            alt="Ramo floral RoseLune"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
            Sobre nosotros
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Belleza natural, hecha a mano
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            En RoseLune creamos arreglos que acompañan celebraciones y gestos
            cotidianos en El Progreso, Yoro y San Pedro Sula. Cada pieza nace del
            cuidado por la flor y por quien la recibe.
          </p>
          <ul className="mt-8 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex gap-3 text-sm text-ink">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                {point}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
