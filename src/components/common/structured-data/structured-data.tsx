import { BRAND_CONFIG } from "@/config/brand.config";
import { LINKS } from "@/config/links.config";
import { fetchPricingData } from "@/config/pricing.config";
import faqLocale from "../../../../public/locales/ru/landing.json";

type FaqItem = { question: string; answer: string };
const FAQ_ITEMS = faqLocale.faq.items as FaqItem[];

/**
 * JSON-LD разметка для поисковых систем (schema.org).
 * Organization + WebSite + SoftwareApplication описывают бренд и продукт
 * в терминах нового позиционирования «один канал → вся сеть».
 * Базовая цена берётся из тарифов (fetchPricingData дедуплицируется Next
 * с запросом на странице, отдельного обращения к API не создаёт).
 */
export async function StructuredData() {
  const { siteUrl, name, nameEn, supportEmail } = BRAND_CONFIG;
  const logoUrl = `${siteUrl}/images/nyambot_logo_square.png`;

  const { plans } = await fetchPricingData();
  const basePlan =
    plans.find((p) => p.months === 1) ??
    plans.reduce((min, p) => (p.priceRub < min.priceRub ? p : min), plans[0]);
  const basePrice = String(basePlan.priceRub);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name,
        alternateName: nameEn,
        url: siteUrl,
        logo: logoUrl,
        email: supportEmail,
        sameAs: [
          LINKS.social.telegram,
          LINKS.social.max,
          LINKS.social.vk,
          LINKS.social.youtube,
          LINKS.social.rutube,
          LINKS.social.ok,
          LINKS.social.dzen,
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name,
        inLanguage: "ru-RU",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#software`,
        name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, Telegram, MAX",
        url: siteUrl,
        publisher: { "@id": `${siteUrl}/#organization` },
        description:
          "Платформа собственного канала приёма заказов и доставки в MAX и Telegram для общепита и микро-ритейла: гость заказывает напрямую, своя база гостей, повторные заказы без комиссии агрегатора, один бот на все точки сети, CRM, приложение «Команда» для администратора и курьера, интеграция с iiko и R-Keeper, онлайн-оплата и доставка через Яндекс.Доставку.",
        offers: {
          "@type": "Offer",
          priceCurrency: "RUB",
          price: basePrice,
          category: "subscription",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
