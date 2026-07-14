"use client";

import { motion } from "framer-motion";
import { BRAND, WHATSAPP_NUMBER } from "@/lib/constants";

export default function CtaBand() {
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola ${BRAND}, me gustaría consultar por un arreglo floral personalizado.`,
  )}`;

  return (
    <section id="contacto" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-br from-leaf via-leaf to-leaf-deep px-6 py-14 text-center sm:px-10 sm:py-16"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-petal/25 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 left-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <h2 className="relative font-display text-3xl text-white sm:text-4xl">
            ¿Listo para alegrar el día de alguien?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-white/85">
            Escríbenos por WhatsApp y te ayudamos a elegir el arreglo perfecto.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-white px-5 py-3 text-sm font-medium text-leaf-deep transition hover:bg-petal-soft"
            >
              Abrir WhatsApp
            </a>
            <a
              href="#arreglos"
              className="rounded-md border border-white/35 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Ver catálogo
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
