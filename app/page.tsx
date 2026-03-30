/**
 * Landing page — public entry point for the AI Text Detector application.
 */

import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { LanguagesSection } from "@/components/landing/languages-section";
import { Footer } from "@/components/landing/footer";
import { ScrollToTop } from "@/components/landing/scroll-to-top";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <LanguagesSection />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
