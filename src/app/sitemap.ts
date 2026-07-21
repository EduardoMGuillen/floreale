import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = SITE_URL.replace(/\/$/, "");
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: origin, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${origin}/productos`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${origin}/contacto`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${origin}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    productPages = products.map((p) => ({
      url: `${origin}/producto/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    /* products unavailable at build time */
  }

  return [...staticPages, ...productPages];
}
