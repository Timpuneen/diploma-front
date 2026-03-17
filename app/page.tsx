/**
 * Landing page — public entry point for the AI Text Detector application.
 * TEMPORARY: Redirecting to dashboard for testing
 */

import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/dashboard/analyze");
}

// Original landing page code (commented out temporarily):
// import { Navbar } from "@/components/landing/navbar";
// import { HeroSection } from "@/components/landing/hero-section";
// import { FeaturesSection } from "@/components/landing/features-section";
// import { HowItWorksSection } from "@/components/landing/how-it-works-section";
// import { LanguagesSection } from "@/components/landing/languages-section";
// import { Footer } from "@/components/landing/footer";

// export default function HomePage() {
//   return (
//     <main>
//       <Navbar />
//       <HeroSection />
//       <FeaturesSection />
//       <HowItWorksSection />
//       <LanguagesSection />
//       <Footer />
//     </main>
//   );
// }
