import { Header } from "@/components/ui/header/header";
import { Footer } from "@/components/ui/footer/footer";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { StatsSection } from "@/components/sections/stats/stats-section";
import { FeaturesSection } from "@/components/sections/features/features-section";
import { CrmDemoSection } from "@/components/sections/crm-demo/crm-demo-section";
import { TryDemoSection } from "@/components/sections/try-demo/try-demo-section";
import { HowItWorksSection } from "@/components/sections/how-it-works/how-it-works-section";
import { ComparisonSection } from "@/components/sections/comparison/comparison-section";
import { PricingSection } from "@/components/sections/pricing/pricing-section";
import { FaqSection } from "@/components/sections/faq/faq-section";
import { CtaSection } from "@/components/sections/cta/cta-section";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <CrmDemoSection />
        <TryDemoSection />
        <HowItWorksSection />
        <ComparisonSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
