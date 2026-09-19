import { StructuredData } from "@/components/common/structured-data/structured-data";
import { Header } from "@/components/ui/header/header";
import { Footer } from "@/components/ui/footer/footer";
import { DotNav } from "@/components/ui/dot-nav/dot-nav";
import { ScrollDepthTracker } from "@/components/ui/analytics/scroll-depth-tracker";
import { SectionViewTracker } from "@/components/ui/analytics/section-view-tracker";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { KillerSection } from "@/components/sections/killer/killer-section";
import { IntegrationsSection } from "@/components/sections/integrations/integrations-section";
import { ForWhomSection } from "@/components/sections/for-whom/for-whom-section";
import { FeaturesSection } from "@/components/sections/features/features-section";
import { CrmDemoSection } from "@/components/sections/crm-demo/crm-demo-section";
import { TryDemoSection } from "@/components/sections/try-demo/try-demo-section";
import { PricingSection } from "@/components/sections/pricing/pricing-section";
import { FaqSection } from "@/components/sections/faq/faq-section";
import { GuestsPathSection } from "@/components/sections/guests-path/guests-path-section";
import { SolutionsSection } from "@/components/sections/solutions/solutions-section";
import { CtaSection } from "@/components/sections/cta/cta-section";
import { SocialSection } from "@/components/sections/social/social-section";
import { PRICING_PLANS } from "@/config/pricing.config";
import { SEO_CONFIG, createPageMetadata } from "@/config/seo.config";

/** Свой адрес главная объявляет сама — корневой layout его не задаёт, иначе
 *  каноническим адресом главной подписались бы и юридические страницы. */
export const metadata = createPageMetadata({
  title: SEO_CONFIG.title,
  description: SEO_CONFIG.description,
  path: "/",
});
export const dynamic = "force-dynamic";

export default function LandingPage() {
  return (
    <>
      <StructuredData withFaq />
      <Header />
      <DotNav />
      <ScrollDepthTracker />
      <SectionViewTracker />
      {/* Порядок: что это → потрогать → для меня ли → откуда гости → что
          приносит деньги → кабинет → сколько стоит → чем дополняется →
          где читать подробнее → возражения → действие.

          🔴 Длина — не украшение, а причина отказа: медиана визита 15 секунд,
          до четверти прежней страницы доходили 5,5% визитов с рекламы. Разделы
          «Сайт или приложение», «Сеть и франшиза», «Безопасность», «Почему мы»,
          «Как работает» и «Переезд» уехали на собственные адреса — это входы из
          выдачи, а ссылки на них собраны в секции «Решения». */}
      <main>
        <HeroSection />
        <KillerSection />
        <TryDemoSection />
        <ForWhomSection />
        <GuestsPathSection />
        <FeaturesSection />
        <CrmDemoSection />
        <PricingSection plans={PRICING_PLANS} />
        <IntegrationsSection />
        <SolutionsSection />
        <FaqSection />
        <CtaSection />
        <SocialSection />
      </main>
      <Footer />
    </>
  );
}
