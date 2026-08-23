import { CONTACT } from "@/lib/constants";

const faqs = [
  {
    question: "¿RoseLune es una floristería en Honduras?",
    answer:
      "Sí. RoseLune es una floristería en Honduras con entrega a domicilio en El Progreso, Yoro y San Pedro Sula. Todos los pedidos se coordinan por WhatsApp.",
  },
  {
    question: "¿Qué tipo de productos florales tienen?",
    answer:
      "Trabajamos ramos, cajas, canastas, arreglos florales, globos y detalles personalizados para eventos como cumpleaños, aniversarios, bodas y baby showers.",
  },
  {
    question: "¿Hacen arreglos y globos para eventos?",
    answer:
      "Sí, diseñamos ramos, canastas y globos a medida para eventos y celebraciones. Cuéntanos la fecha y el estilo que buscas y te armamos una propuesta.",
  },
  {
    question: "¿Cómo hago un pedido?",
    answer:
      "Elige el producto en nuestro catálogo y escríbenos por WhatsApp, o contáctanos directamente para armar un ramo, caja o canasta personalizada.",
  },
  {
    question: "¿A qué zonas de Honduras hacen entregas?",
    answer: `Entregamos en El Progreso, Yoro y San Pedro Sula. Nuestra dirección de referencia es ${CONTACT.address}; escríbenos para confirmar cobertura en tu zona.`,
  },
  {
    question: "¿Cuánto tarda la entrega de un ramo o arreglo?",
    answer:
      "Los tiempos de entrega se coordinan por WhatsApp al confirmar tu pedido, según disponibilidad y la zona de entrega en El Progreso, Yoro o San Pedro Sula.",
  },
];

export default function Faq() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-line bg-soft/60 py-20"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
            Preguntas frecuentes
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Todo sobre nuestra floristería en Honduras
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="group border border-line bg-paper p-4 open:bg-white sm:p-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-ink">
                {item.question}
                <span className="shrink-0 text-brand transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
