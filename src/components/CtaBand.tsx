"use client";

import { motion } from "framer-motion";
import { BRAND, CONTACT, WHATSAPP_NUMBER } from "@/lib/constants";

export default function CtaBand() {
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola ${BRAND}, me gustaría consultar por un arreglo floral.`,
  )}`;

  return (
    <section id="contacto" className="scroll-mt-24 border-t border-line bg-blush/50 py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
            Contactos
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Hablemos de tu próximo detalle
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted">
            Escríbenos por WhatsApp y te ayudamos a elegir el arreglo perfecto.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-pill">
              WhatsApp
            </a>
            <a href="/#catalogo" className="btn-pill">
              Ver catálogo
            </a>
          </div>
          <p className="mt-8 text-sm text-muted">{CONTACT.phoneDisplay}</p>
        </motion.div>
      </div>
    </section>
  );
}
