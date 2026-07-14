export const BRAND = "RoseLune";
export const BRAND_TAGLINE = "Floristería";
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "") || "50493720140";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const NEXUS_URL = "https://www.nexusglobalsuministros.com/";
export const AUTH_COOKIE = "roselune_session";

export const CONTACT = {
  phoneDisplay: "+504 9372-0140",
  phoneHref: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "") || "50493720140"}`,
  email: "hola@roselune.com",
  address: "Honduras",
};

export const NAV_LINKS = [
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/#entrega", label: "Entrega" },
  { href: "/constructor", label: "Constructor" },
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
