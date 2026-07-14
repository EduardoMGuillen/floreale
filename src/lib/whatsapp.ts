import { BRAND, SITE_URL, WHATSAPP_NUMBER } from "./constants";

export function productPageUrl(id: string) {
  const base = SITE_URL.replace(/\/$/, "");
  return `${base}/producto/${id}`;
}

export function whatsappBuyUrl(product: {
  id: string;
  name: string;
  price?: number;
}) {
  const link = productPageUrl(product.id);
  const priceLine =
    typeof product.price === "number"
      ? `\nPrecio de referencia: L ${product.price.toLocaleString("es-HN")}`
      : "";
  const message = `Hola ${BRAND} 🌿

Me interesa solicitar este producto:

*${product.name}*${priceLine}

Enlace del producto:
${link}

¿Me pueden confirmar disponibilidad y forma de entrega?`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
