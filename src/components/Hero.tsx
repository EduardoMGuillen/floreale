"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";
import { demoImages } from "@/lib/demo-images";

export default function Hero() {
  return (
    <section className="relative h-[62vh] min-h-[340px] max-h-[560px] w-full overflow-hidden sm:h-[68vh]">
      <Image
        src={demoImages.hero}
        alt="Catálogo floral RoseLune"
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
        <motion.a
          href="#catalogo"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="btn-pill btn-pill-light mt-8"
        >
          Ver todo
        </motion.a>
      </div>
    </section>
  );
}
