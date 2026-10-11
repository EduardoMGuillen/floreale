import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Products from "@/components/Products";
import {
  BRAND,
  BUSINESS_LD_ID,
  CATALOG_FILTERS,
  CONTACT,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  LOCAL_LANDING_PATH,
  OPENING_HOURS,
  SITE_URL,
  WHATSAPP_NUMBER,
} from "@/lib/constants";
import { jsonLdHtml } from "@/lib/json-ld";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

const title = `Floristería en El Progreso, Yoro | ${BRAND} — Flores a domicilio`;
const description =
  "RoseLune es una floristería en El Progreso, Yoro, Honduras: ramos, cajas con flores, canastas, arreglos florales, globos y decoración para eventos, con entrega a domicilio. Pide por WhatsApp.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: LOCAL_LANDING_PATH },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}${LOCAL_LANDING_PATH}`,
    type: "website",
    locale: "es_HN",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${BRAND} floristería en El Progreso` }],
  },
};

const occasions = [
  "Cumpleaños",
  "Aniversarios y San Valentín",
  "Día de la Madre",
  "Graduaciones",
  "Bodas y baby showers",
  "Detalles sorpresa",
  "Decoración de eventos con flores y globos",
];

const localFaqs = [
  {
    question: "¿Qué floristería recomiendan en El Progreso, Yoro?",
    answer: `${BRAND} es una floristería de El Progreso, Yoro, especializada en ramos, cajas con flores, canastas, arreglos florales, globos y decoración para eventos. Tiene catálogo en línea con precios en lempiras y atiende pedidos por WhatsApp al ${CONTACT.phoneDisplay}.`,
  },
  {
    question: "¿Hacen entregas de flores a domicilio en El Progreso?",
    answer:
      "Sí. RoseLune entrega a domicilio dentro de El Progreso, Yoro, y también en San Pedro Sula. La hora y el lugar de entrega se coordinan por WhatsApp al confirmar el pedido.",
  },
  {
    question: "¿Cuánto cuesta un ramo de flores en El Progreso?",
    answer:
      "Los precios de cada ramo, caja o arreglo están publicados en lempiras (HNL) en el catálogo de RoseLune. También se pueden cotizar diseños personalizados según presupuesto.",
  },
  {
    question: "¿Puedo pedir flores para una fecha específica?",
    answer:
      "Sí. Puedes reservar con anticipación para cumpleaños, aniversarios, Día de la Madre, San Valentín o cualquier evento. Escríbenos por WhatsApp con la fecha y la dirección de entrega.",
  },
  {
    question: "¿Cómo pago mi pedido de flores?",
    answer:
      "El método de pago se confirma por WhatsApp al cerrar el pedido. Los precios están en lempiras hondureños.",
  },
];

export default async function FloristeriaElProgresoPage() {
  const products = await getProducts();
  const pageUrl = `${SITE_URL}${LOCAL_LANDING_PATH}`;
  const categories = CATALOG_FILTERS.filter((f) => f.id !== "all");
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hola, quiero pedir flores con entrega en El Progreso.",
  )}`;

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#pagina`,
    url: pageUrl,
    name: title,
    description,
    inLanguage: "es-HN",
    isPartOf: { "@id": `${SITE_URL}/#sitio` },
    about: { "@id": BUSINESS_LD_ID },
    mainEntity: { "@id": BUSINESS_LD_ID },
    spatialCoverage: {
      "@type": "Place",
      name: "El Progreso, Yoro, Honduras",
    },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: localFaqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Floristería en El Progreso",
        item: pageUrl,
      },
    ],
  };

  return (
    <div className="bg-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(webPageLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(faqLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(breadcrumbLd)} />
      <Header />
      <main>
        <section className="border-b border-line bg-blush/40 px-4 py-14 text-center sm:px-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
            El Progreso, Yoro · Honduras
          </p>
          <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
            Floristería en El Progreso, Yoro
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {BRAND} es una floristería en El Progreso, Yoro, que diseña ramos,
            cajas con flores, canastas, arreglos florales, globos y decoración
            para eventos. Entregamos a domicilio en El Progreso y San Pedro Sula,
            y todos los pedidos se coordinan por WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-pill">
              Pedir por WhatsApp
            </a>
            <Link href="/productos" className="btn-pill">
              Ver catálogo
            </Link>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-display text-3xl text-ink">
              Flores y arreglos en El Progreso
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Trabajamos con flores frescas de temporada y armamos cada pieza a
              mano. En nuestro catálogo encuentras:
            </p>
            <ul className="mt-5 space-y-2 text-sm text-ink">
              {categories.map((c) => (
                <li key={c.id} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                  {c.label} de flores con entrega en El Progreso
                </li>
              ))}
            </ul>

            <h2 className="mt-12 font-display text-3xl text-ink">
              Flores para cada ocasión
            </h2>
            <ul className="mt-5 grid gap-2 text-sm text-ink sm:grid-cols-2">
              {occasions.map((o) => (
                <li key={o} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                  {o}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-3xl text-ink">Cómo pedir</h2>
            <ol className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
              <li>
                <span className="text-ink">1. Elige</span> un ramo, caja o
                arreglo en el{" "}
                <Link href="/productos" className="text-brand hover:underline">
                  catálogo en línea
                </Link>{" "}
                (precios en lempiras).
              </li>
              <li>
                <span className="text-ink">2. Escríbenos por WhatsApp</span> con
                el producto, la fecha y la dirección de entrega.
              </li>
              <li>
                <span className="text-ink">3. Recibe</span> tus flores a
                domicilio en El Progreso o San Pedro Sula.
              </li>
            </ol>

            <h2 className="mt-12 font-display text-3xl text-ink">
              Datos de la floristería
            </h2>
            <dl className="mt-5 grid gap-3 text-sm">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">Nombre</dt>
                <dd className="text-ink">{BRAND} Floristería</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">Ubicación</dt>
                <dd className="text-ink">{CONTACT.address}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
                  WhatsApp y teléfono
                </dt>
                <dd>
                  <a href={CONTACT.phoneHref} className="text-ink hover:text-brand">
                    {CONTACT.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">Horario</dt>
                <dd className="text-ink">{OPENING_HOURS.display}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
                  Zonas de entrega
                </dt>
                <dd className="text-ink">El Progreso (Yoro) y San Pedro Sula (Cortés)</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">Instagram</dt>
                <dd>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:text-brand"
                  >
                    {INSTAGRAM_HANDLE}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <Products
          products={products}
          title="Arreglos disponibles en El Progreso"
          sectionId="catalogo-el-progreso"
          limit={6}
          seeAllHref="/productos"
        />

        <section className="border-t border-line bg-soft/60 py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-3xl text-ink">
              Preguntas sobre flores en El Progreso
            </h2>
            <div className="mt-10 space-y-3">
              {localFaqs.map((item) => (
                <details
                  key={item.question}
                  className="group border border-line bg-paper p-4 open:bg-white sm:p-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-ink">
                    {item.question}
                    <span className="shrink-0 text-brand transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
