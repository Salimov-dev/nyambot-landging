import { BRAND_CONFIG } from "@/config/brand.config";
import { LINKS } from "@/config/links.config";
import { PRICING_PLANS } from "@/config/pricing.config";
import faqLocale from "../../../../public/locales/ru/landing.json";

type FaqItem = { question: string; answer: string };
const FAQ_ITEMS = faqLocale.faq.items as FaqItem[];

/**
 * JSON-LD разметка для поисковых систем (schema.org).
 * Organization + WebSite + SoftwareApplication описывают бренд и продукт
 * в терминах нового позиционирования «один канал → вся сеть».
 * Базовая цена берётся из тарифов — тех же чисел, что видит гость в карточках
 * (`PRICING_PLANS`), без обращения к API.
 */
type IProps = {
  /**
   * Включать ли разметку вопросов. По умолчанию нет: компонент стоит в
   * корневом layout, то есть на КАЖДОЙ странице, а вопросы живут на главной.
   * Разметка, которой нет в тексте страницы, для поисковика — обман, и на
   * посадочных она вдобавок сталкивалась со своим блоком FAQPage.
   */
  withFaq?: boolean;
};

export function StructuredData({ withFaq = false }: IProps) {
  const { siteUrl, name, nameEn, supportEmail } = BRAND_CONFIG;
  const logoUrl = `${siteUrl}/images/nyambot_logo_square.png`;

  const plans = PRICING_PLANS;
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
        // Статус участника проекта «Сколково»: внешнее подтверждение проекта,
        // ОРН — публичный идентификатор в реестре Фонда
        memberOf: {
          "@type": "Organization",
          name: "Фонд «Сколково»",
          url: "https://sk.ru",
        },
        identifier: "ОРН 1129172",
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
          "Платформа собственного канала приёма заказов и доставки в MAX и Телеграм для общепита и микро-ритейла: один бот на все точки сети и одна база гостей в двух мессенджерах — история заказов и баллы у гостя общие, повторные заказы без комиссии агрегатора, СРМ, приложение «Команда» для администратора и курьера, интеграция с iiko и R-Keeper, онлайн-оплата и доставка через Яндекс.Доставку.",
        offers: {
          "@type": "Offer",
          priceCurrency: "RUB",
          price: basePrice,
          category: "subscription",
        },
      },
      ...(withFaq
        ? [
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
          ]
        : []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
