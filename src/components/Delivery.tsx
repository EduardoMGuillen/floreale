"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Elige",
    text: "Explora el catálogo o arma tu ramo en el constructor.",
  },
  {
    title: "Confirma",
    text: "Escríbenos por WhatsApp con el producto o tu selección.",
  },
  {
    title: "Recibe",
    text: "Coordinamos entrega o retiro con el cuidado que merece.",
  },
];

export default function Delivery() {
  return (
    <section id="entrega" className="scroll-mt-24 border-t border-line py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-xl text-center"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
            Entrega
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Del taller a tus manos
          </h2>
          <p className="mt-4 text-sm text-muted sm:text-base">
            Pedidos claros, tiempos acordados y flores que llegan impecables.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="text-center"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand">
                0{index + 1}
              </p>
              <h3 className="mt-3 font-display text-2xl text-ink">{step.title}</h3>
              <p className="mt-3 text-sm text-muted">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
