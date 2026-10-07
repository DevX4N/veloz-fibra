import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  // permite build de verificação sem colidir com o `next dev` (NEXT_DIST=.next-build)
  distDir: process.env.NEXT_DIST || ".next",
  async headers() {
    // Projeto demonstrativo: fora dos buscadores até existir domínio real (SITE_INDEXABLE=true).
    if (process.env.SITE_INDEXABLE === "true") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
