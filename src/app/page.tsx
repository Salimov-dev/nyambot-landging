import { StructuredData } from "@/components/common/structured-data/structured-data";
import { Header } from "@/components/ui/header/header";
import { Footer } from "@/components/ui/footer/footer";
import { DotNav } from "@/components/ui/dot-nav/dot-nav";
import { ScrollDepthTracker } from "@/components/ui/analytics/scroll-depth-tracker";
import { SectionViewTracker } from "@/components/ui/analytics/section-view-tracker";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { KillerSection } from "@/components/sections/killer/killer-section";
import { FreeReviewSection } from "@/components/sections/free-review/free-review-section";
import { WhyNowSection } from "@/components/sections/why-now/why-now-section";
import { VitrinaSection } from "@/components/sections/vitrina/vitrina-section";
import { CompareSection } from "@/components/sections/compare/compare-section";
import { IntegrationsSection } from "@/components/sections/integrations/integrations-section";
import { LoyaltySection } from "@/components/sections/loyalty/loyalty-section";
import { ForWhomSection } from "@/components/sections/for-whom/for-whom-section";
import { CrmDemoSection } from "@/components/sections/crm-demo/crm-demo-section";
import { PricingSection } from "@/components/sections/pricing/pricing-section";
import { FaqSection } from "@/components/sections/faq/faq-section";
import { GuestsPathSection } from "@/components/sections/guests-path/guests-path-section";
import { KomandaSection } from "@/components/sections/komanda/komanda-section";
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
      {/* 🔴 Длина — не украшение, а причина отказа: медиана визита 15 секунд,
          до четверти прежней страницы доходили 5,5% визитов с рекламы. Разделы
          «Сайт или приложение», «Сеть и франшиза», «Безопасность», «Почему мы»,
          «Как работает» и «Переезд» уехали на собственные адреса — это входы из
          выдачи, а ссылки на них собраны в секции «Решения». */}
      <main className="landing-main">
        {/* Порядок (Руслан 13.10.2026) — по вопросам, которые ресторатор задаёт
            себе по ходу чтения, чтобы картина сервиса складывалась по шагам:
            А. Что это и зачем мне — Hero → «Почему сейчас» → «Для любого формата».
            Б. Путь одного заказа — что видит гость («Витрина» с «попробуй сам»)
               → откуда он приходит → куда уходит заказ (интеграции) → кто его
               готовит и везёт («Команда») → почему гость вернётся (лояльность)
               → что видишь ты (кабинет).
            В. Почему мы и сколько — запуск бесплатно → выгоды и сравнение →
               тарифы → решения → вопросы → действие.
            «Попробуй прямо сейчас» живёт внутри «Витрины» (два телефона с
            роликами подряд читались повтором), «Возможности» с главной сняты —
            после пути заказа это повтор, страница /vozmozhnosti — в «Решениях» */}
        <HeroSection />
        <WhyNowSection />
        <ForWhomSection />
        <VitrinaSection />
        <GuestsPathSection />
        <IntegrationsSection />
        <KomandaSection />
        <LoyaltySection />
        <CrmDemoSection />
        <FreeReviewSection />
        <KillerSection />
        <CompareSection />
        <PricingSection plans={PRICING_PLANS} />
        <SolutionsSection />
        <FaqSection />
        <CtaSection />
        <SocialSection />
      </main>
      <Footer />
    </>
  );
}
