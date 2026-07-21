import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  const origin = SITE_URL.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/login", "/api/"] },
    sitemap: `${origin}/sitemap.xml`,
  };
}
