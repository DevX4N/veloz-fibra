import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import { company, site } from "@/config/site";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { NetworkStatusProvider } from "@/components/providers/NetworkStatusProvider";
import { ConsentProvider } from "@/components/providers/ConsentProvider";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { AnalyticsScripts } from "@/components/layout/AnalyticsScripts";
import "@/styles/base.css";
import "@/styles/components.css";
import "@/styles/layout.css";
import "@/styles/sections.css";
import "@/styles/pages.css";
import "@/styles/dashboard.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", weight: ["500", "600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${company.name}` },
  description: site.description,
  applicationName: company.name,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: company.name,
    title: site.title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: site.indexable ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  legalName: company.legalName,
  slogan: company.slogan,
  url: site.url,
  email: company.email,
  telephone: company.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address.street,
    addressLocality: company.address.city,
    addressCountry: "BR",
  },
  sameAs: Object.values(company.social),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${inter.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <ConsentProvider>
          <NetworkStatusProvider>
            <ToastProvider>
              {children}
              <CookieBanner />
              <AnalyticsScripts />
            </ToastProvider>
          </NetworkStatusProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
