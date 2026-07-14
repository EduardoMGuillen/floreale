"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";
import { demoImages } from "@/lib/demo-images";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={demoImages.hero}
          alt="Arreglo floral de Floreale"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-leaf-deep/80 via-leaf-deep/55 to-leaf-deep/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-leaf-deep/50 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-20 pt-28 sm:px-6 sm:pb-24 lg:justify-center lg:px-8 lg:pb-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {BRAND}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="mt-4 max-w-xl font-display text-2xl leading-snug text-white/95 sm:text-3xl md:text-4xl"
        >
          Flores que cuentan
          <span className="block text-petal-soft">lo que las palabras no alcanzan</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 max-w-md text-base text-white/85 sm:text-lg"
        >
          Ramos y arreglos frescos, pensados a mano para tus momentos más especiales.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <a
            href="#arreglos"
            className="rounded-md bg-white px-5 py-3 text-sm font-medium text-leaf-deep transition hover:bg-petal-soft"
          >
            Explorar arreglos
          </a>
          <a
            href="#contacto"
            className="rounded-md border border-white/40 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Pedir por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
