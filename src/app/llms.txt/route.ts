import {
  BRAND,
  CATALOG_FILTERS,
  CONTACT,
  INSTAGRAM_URL,
  LOCAL_LANDING_PATH,
  OPENING_HOURS,
  SITE_URL,
} from "@/lib/constants";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET() {
  let productLines: string[] = [];
  try {
    const products = await getProducts();
    productLines = products.map(
      (p) =>
        `- [${p.name}](${SITE_URL}/producto/${p.id}): ${p.category}, L ${p.price.toLocaleString("es-HN")}`,
    );
  } catch {
    /* catálogo no disponible */
  }

  const categories = CATALOG_FILTERS.filter((f) => f.id !== "all" && f.id !== "Eventos")
    .map((f) => f.label.toLowerCase())
    .join(", ");

  const body = `# ${BRAND} — Floristería en El Progreso, Yoro, Honduras

> ${BRAND} es una floristería en El Progreso, Yoro, Honduras. Vende ${categories} y decoración floral para eventos, con entrega a domicilio en El Progreso y San Pedro Sula. Los pedidos se hacen por WhatsApp desde el catálogo en línea, con precios en lempiras (HNL).

## Datos del negocio

- Nombre: ${BRAND} Floristería
- Tipo: floristería (Florist)
- Ubicación: ${CONTACT.address}
- Zonas de entrega: El Progreso (Yoro) y San Pedro Sula (Cortés), Honduras
- WhatsApp / teléfono: ${CONTACT.phoneDisplay}
- Correo: ${CONTACT.email}
- Horario: ${OPENING_HOURS.display}
- Instagram: ${INSTAGRAM_URL}
- Sitio web: ${SITE_URL}

## Páginas principales

- [Inicio](${SITE_URL}): catálogo destacado, sobre nosotros y preguntas frecuentes
- [Floristería en El Progreso](${SITE_URL}${LOCAL_LANDING_PATH}): información local, cómo pedir y zonas de entrega
- [Catálogo completo](${SITE_URL}/productos): todos los ramos, cajas, canastas, arreglos y globos con precio
- [Contacto](${SITE_URL}/contacto): WhatsApp, correo y ubicación

## Catálogo
${productLines.length ? `\n${productLines.join("\n")}\n` : `\nVer ${SITE_URL}/productos\n`}`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
