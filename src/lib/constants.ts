export const BRAND = "RoseLune";
export const BRAND_TAGLINE = "Floristería";
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "") || "50493720140";
/** Solo origin (sin path). La app no usa basePath; paths tipo /prueba-edu rompen enlaces de WhatsApp. */
function toOrigin(url: string) {
  try {
    return new URL(url.includes("://") ? url : `https://${url}`).origin;
  } catch {
    return url.replace(/\/$/, "");
  }
}

function resolveSiteUrl() {
  const explicit = (process.env.NEXT_PUBLIC_SITE_URL || "").trim().replace(/\/$/, "");
  const onVercel = process.env.VERCEL === "1";
  const isLocalhost = !explicit || /localhost|127\.0\.0\.1/i.test(explicit);

  // En Vercel, ignora localhost (suele venir copiado del .env de desarrollo).
  if (explicit && !(onVercel && isLocalhost)) {
    return toOrigin(explicit);
  }

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) {
    return toOrigin(`https://${vercelProd.replace(/^https?:\/\//, "")}`);
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return toOrigin(`https://${vercelUrl.replace(/^https?:\/\//, "")}`);
  }

  return toOrigin(explicit || "http://localhost:3000");
}

export const SITE_URL = resolveSiteUrl();
export const NEXUS_URL = "https://www.nexusglobalsuministros.com/";
export const AUTH_COOKIE = "roselune_session";

export const INSTAGRAM_URL = "https://www.instagram.com/roselunehn/";
export const INSTAGRAM_HANDLE = "@roselunehn";
export const GA_MEASUREMENT_ID = "G-Z7P7YCK44P";
export const ADSENSE_PUBLISHER_ID = "ca-pub-5358801062744911";

export const CONTACT = {
  phoneDisplay: "+504 9372-0140",
  phoneHref: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "") || "50493720140"}`,
  email: "hola@roselune.com",
  address: "El Progreso, Yoro, Honduras",
};

export const NAV_LINKS = [
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/#entrega", label: "Entrega" },
  { href: "/productos", label: "Todos los productos" },
  { href: "/#contacto", label: "Contactos" },
] as const;

export const CATALOG_FILTERS = [
  { id: "all", label: "Todos" },
  { id: "Ramos", label: "Ramos" },
  { id: "Arreglos", label: "Arreglos" },
  { id: "Cajas", label: "Cajas" },
  { id: "Plantas", label: "Plantas" },
  { id: "Rosas", label: "Rosas" },
] as const;
