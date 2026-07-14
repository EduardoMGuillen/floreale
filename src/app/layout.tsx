import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import {
  BRAND,
  BRAND_TAGLINE,
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

const title = `${BRAND} | ${BRAND_TAGLINE}`;
const description =
  "RoseLune — ramos y arreglos florales elegantes. Catálogo online y pedidos por WhatsApp.";

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
    siteName: BRAND,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${BRAND} ${BRAND_TAGLINE}`,
      },
      {
        url: "/logo.png",
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
    images: ["/og.png", "/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Florist",
    name: BRAND,
    description,
    url: SITE_URL,
    logo: `${SITE_URL.replace(/\/$/, "")}/logo.png`,
    image: `${SITE_URL.replace(/\/$/, "")}/og.png`,
    sameAs: [INSTAGRAM_URL],
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
        {children}
      </body>
    </html>
  );
}
