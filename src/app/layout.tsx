import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import Script from "next/script";
import {
  BRAND,
  BRAND_TAGLINE,
  GA_MEASUREMENT_ID,
  ADSENSE_PUBLISHER_ID,
  CONTACT,
  INSTAGRAM_URL,
  SITE_URL,
} from "@/lib/constants";
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

const title = `${BRAND} | Floristería en El Progreso, Yoro y San Pedro Sula, Honduras`;
const description =
  "RoseLune — floristería premium en El Progreso, Yoro y San Pedro Sula. Ramos, arreglos florales y flores frescas con entrega a domicilio. Pedidos por WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: BRAND,
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
    "floristería El Progreso Yoro",
    "floristería San Pedro Sula",
    "floristería Honduras",
    "flores El Progreso",
    "ramos florales Honduras",
    "arreglos florales San Pedro Sula",
    "flores frescas Honduras",
    "RoseLune",
  ],
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
    name: BRAND,
    description,
    url: SITE_URL,
    logo: `${siteOrigin}/logo.png`,
    image: `${siteOrigin}/og.png`,
    sameAs: [INSTAGRAM_URL],
    telephone: CONTACT.phoneDisplay,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "El Progreso",
      addressRegion: "Yoro",
      addressCountry: "HN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 15.4,
      longitude: -87.8,
    },
    areaServed: [
      { "@type": "City", name: "El Progreso, Yoro" },
      { "@type": "City", name: "San Pedro Sula" },
      { "@type": "Country", name: "Honduras" },
    ],
    priceRange: "$$",
    currenciesAccepted: "HNL",
    paymentAccepted: "Efectivo, Transferencia bancaria, WhatsApp Pay",
    openingHours: "Mo-Sa 08:00-18:00",
  };

  return (
    <html lang="es" className={`${display.variable} ${sans.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
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
