import { Header } from "@/components/ui/header/header";
import { Footer } from "@/components/ui/footer/footer";
import { DotNav } from "@/components/ui/dot-nav/dot-nav";
import { ScrollDepthTracker } from "@/components/ui/analytics/scroll-depth-tracker";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { KillerSection } from "@/components/sections/killer/killer-section";
import { IntegrationsSection } from "@/components/sections/integrations/integrations-section";
import { ForWhomSection } from "@/components/sections/for-whom/for-whom-section";
import { FeaturesSection } from "@/components/sections/features/features-section";
import { CrmDemoSection } from "@/components/sections/crm-demo/crm-demo-section";
import { TryDemoSection } from "@/components/sections/try-demo/try-demo-section";
import { HowItWorksSection } from "@/components/sections/how-it-works/how-it-works-section";
import { SwitchSection } from "@/components/sections/switch/switch-section";
import { SecuritySection } from "@/components/sections/security/security-section";
import { WhySection } from "@/components/sections/why/why-section";
import { PricingSection } from "@/components/sections/pricing/pricing-section";
import { FaqSection } from "@/components/sections/faq/faq-section";
import { CtaSection } from "@/components/sections/cta/cta-section";
import { SocialSection } from "@/components/sections/social/social-section";
import { PRICING_PLANS } from "@/config/pricing.config";

export const dynamic = "force-dynamic";

export default function LandingPage() {
  return (
    <>
      <Header />
      <DotNav />
      <ScrollDepthTracker />
      {/* Порядок: что это → потрогать → для меня ли → что умеет → сколько
          стоит → как начать → чем дополняется → доверие → возражения → действие.
          Интеграции опущены с третьей позиции: наверху они читались как список
          требований к тому, у кого нет кассы. */}
      <main>
        <HeroSection />
        <KillerSection />
        <TryDemoSection />
        <ForWhomSection />
        <FeaturesSection />
        <CrmDemoSection />
        <PricingSection plans={PRICING_PLANS} />
        <HowItWorksSection />
        <IntegrationsSection />
        <SwitchSection />
        <SecuritySection />
        <WhySection />
        <FaqSection />
        <CtaSection />
        <SocialSection />
      </main>
      <Footer />
    </>
  );
}
