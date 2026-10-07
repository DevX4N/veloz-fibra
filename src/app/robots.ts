import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Projeto demonstrativo: bloqueado até SITE_INDEXABLE=true (domínio real).
  if (!site.indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/area-do-cliente/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
