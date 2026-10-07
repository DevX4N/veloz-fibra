import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { cities } from "@/data/coverage";

const routes = [
  "", "/planos", "/empresas", "/cobertura", "/internet-fibra", "/teste-de-velocidade", "/status", "/suporte",
  "/segunda-via", "/sobre", "/contato", "/assine", "/trabalhe-conosco", "/politica-de-privacidade", "/termos-de-uso",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...routes.map((r) => ({ url: `${site.url}${r}`, lastModified: now, changeFrequency: "weekly" as const, priority: r === "" ? 1 : 0.7 })),
    ...cities.map((c) => ({ url: `${site.url}/internet-fibra/${c.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
