import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import Script from "next/script";
import {
  BRAND,
  BRAND_TAGLINE,
  GA_MEASUREMENT_ID,
  ADSENSE_PUBLISHER_ID,
  GOOGLE_SITE_VERIFICATION,
  BING_SITE_VERIFICATION,
  BUSINESS_LD_ID,
  CONTACT,
  INSTAGRAM_URL,
  OPENING_HOURS,
  SITE_URL,
  CATALOG_FILTERS,
} from "@/lib/constants";
import { jsonLdHtml } from "@/lib/json-ld";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const title = `${BRAND} | Floristería en El Progreso, Yoro — Flores a domicilio en Honduras`;
const description =
  "RoseLune es una floristería en El Progreso, Yoro, Honduras. Ramos, cajas, canastas, arreglos florales, globos y detalles para eventos, con entrega a domicilio en El Progreso y San Pedro Sula. Pedidos por WhatsApp.";

const categoryKeywords = CATALOG_FILTERS.filter((f) => f.id !== "all").map(
  (f) => `${f.label.toLowerCase()} de flores Honduras`,
);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: BRAND,
  category: "shopping",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: BRAND,
    images: [
      {
        url: "/og.png",
        secureUrl: "/og.png",
        type: "image/png",
        width: 1200,
        height: 630,
        alt: `${BRAND} ${BRAND_TAGLINE}`,
      },
      {
        url: "/logo.png",
        type: "image/png",
        width: 648,
        height: 268,
        alt: `${BRAND} logo`,
      },
    ],
    type: "website",
    locale: "es_HN",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  keywords: [
    "floristería El Progreso",
    "floristería en El Progreso Yoro",
    "mejor floristería El Progreso",
    "flores a domicilio El Progreso",
    "arreglos florales El Progreso",
    "floristería Honduras",
    "floristería San Pedro Sula",
    "florería cerca de mí",
    "flores El Progreso",
    "ramos de flores Honduras",
    "arreglos florales para eventos",
    "flores para eventos Honduras",
    "envío de flores a domicilio Honduras",
    "flores frescas Honduras",
    ...categoryKeywords,
    "RoseLune",
  ],
  verification: {
    ...(GOOGLE_SITE_VERIFICATION ? { google: GOOGLE_SITE_VERIFICATION } : {}),
    ...(BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": BING_SITE_VERIFICATION } }
      : {}),
  },
  other: {
    "google-adsense-account": ADSENSE_PUBLISHER_ID,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteOrigin = SITE_URL.replace(/\/$/, "");
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": ["Florist", "LocalBusiness"],
    "@id": BUSINESS_LD_ID,
    name: BRAND,
    alternateName: ["RoseLune Floristería", "RoseLune Floristería El Progreso"],
    description,
    slogan: "Floristería en El Progreso, Yoro: ramos, cajas, canastas, arreglos, globos y eventos",
    url: SITE_URL,
    logo: `${siteOrigin}/logo.png`,
    image: `${siteOrigin}/og.png`,
    sameAs: [INSTAGRAM_URL],
    telephone: CONTACT.phoneE164,
    email: CONTACT.email,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT.phoneE164,
      contactType: "customer service",
      areaServed: "HN",
      availableLanguage: "es",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "El Progreso",
      addressRegion: "Yoro",
      postalCode: "23201",
      addressCountry: "HN",
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${BRAND} floristería ${CONTACT.address}`,
    )}`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: 15.4,
      longitude: -87.8,
    },
    areaServed: [
      { "@type": "City", name: "El Progreso, Yoro" },
      { "@type": "City", name: "San Pedro Sula" },
      { "@type": "City", name: "Yoro" },
      { "@type": "Country", name: "Honduras" },
    ],
    priceRange: "$$",
    currenciesAccepted: "HNL",
    paymentAccepted: "Efectivo, Transferencia bancaria, WhatsApp Pay",
    openingHours: OPENING_HOURS.schema,
    knowsAbout: CATALOG_FILTERS.filter((f) => f.id !== "all").map(
      (f) => f.label,
    ),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catálogo de flores RoseLune",
      itemListElement: CATALOG_FILTERS.filter((f) => f.id !== "all").map(
        (f) => ({
          "@type": "OfferCatalog",
          name: f.label,
        }),
      ),
    },
  };
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteOrigin}/#sitio`,
    name: BRAND,
    url: SITE_URL,
    inLanguage: "es-HN",
    publisher: { "@id": BUSINESS_LD_ID },
  };

  return (
    <html lang="es-HN" className={`${display.variable} ${sans.variable} h-full`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(organizationLd)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(websiteLd)} />
      </head>
      <body className="min-h-full bg-paper font-sans text-ink antialiased">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
