import type { Metadata } from "next";
import { site } from "@/config/site";
import { Hero } from "@/components/home/Hero";
import { QuickServices } from "@/components/home/QuickServices";
import { Stats } from "@/components/home/Stats";
import { PlansSection } from "@/components/plans/PlansSection";
import { Benefits } from "@/components/home/Benefits";
import { GamerSection } from "@/components/home/GamerSection";
import { ConnectedHome } from "@/components/home/ConnectedHome";
import { CoverageSection } from "@/components/home/CoverageSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Cities } from "@/components/home/Cities";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQSection } from "@/components/shared/FAQSection";
import { FinalCTA } from "@/components/shared/FinalCTA";
import { benefits, faqs } from "@/data/content";

export const metadata: Metadata = {
  title: { absolute: site.title },
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickServices />
      <Stats />
      <PlansSection />
      <Benefits items={benefits} />
      <GamerSection />
      <ConnectedHome />
      <CoverageSection />
      <HowItWorks />
      <Cities />
      <AboutTeaser />
      <Testimonials />
      <FAQSection items={faqs.general} white />
      <FinalCTA />
    </>
  );
}
