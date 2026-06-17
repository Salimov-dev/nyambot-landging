import { Header } from "@/components/ui/header/header";
import { Footer } from "@/components/ui/footer/footer";
import { DotNav } from "@/components/ui/dot-nav/dot-nav";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { VideoSection } from "@/components/sections/video/video-section";
import { IntegrationsSection } from "@/components/sections/integrations/integrations-section";
import { FeaturesSection } from "@/components/sections/features/features-section";
import { CrmDemoSection } from "@/components/sections/crm-demo/crm-demo-section";
import { TryDemoSection } from "@/components/sections/try-demo/try-demo-section";
import { HowItWorksSection } from "@/components/sections/how-it-works/how-it-works-section";
import { SwitchSection } from "@/components/sections/switch/switch-section";
import { SecuritySection } from "@/components/sections/security/security-section";
import { PricingSection } from "@/components/sections/pricing/pricing-section";
import { FaqSection } from "@/components/sections/faq/faq-section";
import { CtaSection } from "@/components/sections/cta/cta-section";
import { SocialSection } from "@/components/sections/social/social-section";
import { fetchPricingData } from "@/config/pricing.config";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const { plans, limits } = await fetchPricingData();

  return (
    <>
      <Header />
      <DotNav />
      <main>
        <HeroSection />
        <VideoSection />
        <IntegrationsSection />
        <FeaturesSection />
        <CrmDemoSection />
        <TryDemoSection />
        <HowItWorksSection />
        <SwitchSection />
        <SecuritySection />
        <PricingSection plans={plans} limits={limits} />
        <FaqSection />
        <CtaSection />
        <SocialSection />
        <IntegrationsSection />
      </main>
      <Footer />
    </>
  );
}
