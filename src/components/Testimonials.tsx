"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "El ramo llegó impecable y exactamente como lo pedí. Se notó el cuidado en cada detalle.",
    author: "María G.",
  },
  {
    quote:
      "Pedí un arreglo para el aniversario y mi pareja quedó encantada. Comunicación rápida por WhatsApp.",
    author: "Carlos R.",
  },
  {
    quote:
      "Usamos Floreale para la recepción de nuestra oficina. Ambiente fresco y muy elegante.",
    author: "Ana P.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonios" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-sage">
            Clientes
          </p>
          <h2 className="mt-3 font-display text-3xl text-leaf-deep sm:text-4xl">
            Lo que dicen de nosotros
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.author}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="border-t border-leaf/15 pt-6"
            >
              <p className="font-display text-3xl leading-none text-petal/70">&ldquo;</p>
              <p className="mt-2 text-ink/90 leading-relaxed">{item.quote}</p>
              <footer className="mt-5 text-sm font-medium text-sage">
                — {item.author}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
