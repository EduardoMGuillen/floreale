"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BRAND, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/constants";
import { demoImages } from "@/lib/demo-images";

export default function Hero() {
  return (
    <section className="relative h-[62vh] min-h-[340px] max-h-[560px] w-full overflow-hidden sm:h-[68vh]">
      <Image
        src={demoImages.hero}
        alt="Flor rosa RoseLune"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/40" />

      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-[11px] font-medium uppercase tracking-[0.35em]"
        >
          {BRAND}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mt-3 text-5xl font-medium uppercase tracking-[0.2em] sm:text-6xl md:text-7xl"
        >
          Catálogo
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.13 }}
          className="mt-3 max-w-md text-sm tracking-wide text-white/90 sm:text-base"
        >
          Flores frescas en El Progreso, Yoro y San Pedro Sula
        </motion.p>
        <motion.a
          href="/productos"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="btn-pill btn-pill-light mt-8"
        >
          Ver todo
        </motion.a>
        <motion.a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="mt-5 inline-flex items-center gap-2 text-sm tracking-wide text-white/85 transition hover:text-white"
          aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
          </svg>
          {INSTAGRAM_HANDLE}
        </motion.a>
      </div>
    </section>
  );
}
