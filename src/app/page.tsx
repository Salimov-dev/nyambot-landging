import { Header } from "@/components/ui/header/header";
import { Footer } from "@/components/ui/footer/footer";
import { DotNav } from "@/components/ui/dot-nav/dot-nav";
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
import { fetchPricingData } from "@/config/pricing.config";

export default async function LandingPage() {
  const { plans, limits } = await fetchPricingData();

  return (
    <>
      <Header />
      <DotNav />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <CrmDemoSection />
        <TryDemoSection />
        <HowItWorksSection />
        <ComparisonSection />
        <PricingSection plans={plans} limits={limits} />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
