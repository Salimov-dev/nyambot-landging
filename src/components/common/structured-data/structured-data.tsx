import { BRAND_CONFIG } from "@/config/brand.config";
import { LINKS } from "@/config/links.config";
import { fetchPricingData } from "@/config/pricing.config";

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
          "Платформа собственного канала продаж в MAX и Telegram для сетей общепита и микро-ритейла: один бот на все точки сети, своя база клиентов, повторные заказы без комиссии агрегатора, CRM, приложение «Команда» для администратора и курьера, интеграция с iiko и R-Keeper, доставка через Яндекс.Доставку.",
        offers: {
          "@type": "Offer",
          priceCurrency: "RUB",
          price: basePrice,
          category: "subscription",
        },
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
