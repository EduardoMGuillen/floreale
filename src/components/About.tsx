"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { demoImages } from "@/lib/demo-images";

const points = [
  "Flores frescas de temporada, seleccionadas a diario",
  "Diseño a medida para eventos, regalos y espacios",
  "Entrega cuidadosa en la zona, coordinada por WhatsApp",
];

export default function About() {
  return (
    <section id="sobre" className="scroll-mt-20 bg-mist/70 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="relative aspect-[4/5] overflow-hidden"
        >
          <Image
            src={demoImages.about}
            alt="Taller floral de Floreale"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-sage">
            Sobre Floreale
          </p>
          <h2 className="mt-3 font-display text-3xl text-leaf-deep sm:text-4xl">
            Belleza natural, hecha a mano
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            En Floreale creamos arreglos que acompañan celebraciones, gestos
            cotidianos y espacios que merecen un toque vivo. Cada pieza nace
            del cuidado por la flor y por quien la recibe.
          </p>
          <ul className="mt-8 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex gap-3 text-sm text-ink sm:text-base">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-petal" />
                {point}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
