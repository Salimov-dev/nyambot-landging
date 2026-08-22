import type { Metadata } from "next";
import { BRAND_CONFIG } from "@/config/brand.config";

/**
 * Мета-теги главной страницы. Живут отдельно от layout, потому что тем же
 * набором пользуются юридические страницы: Next заменяет блок `openGraph`
 * целиком, а не по полям, — переопределяя заголовок, страница обязана
 * заново перечислить картинку и остальное, иначе превью ссылки опустеет.
 *
 * Заголовок и описание держим в пределах того, что показывают выдачи:
 * title ≈ 70 символов, description ≈ 230 — длинный текст всё равно
 * обрезается, а обрезанный теряет УТП в середине.
 *
 * 🔴 Правила текста, выведенные из разбора выдачи (22.08.2026):
 * — про еду сказано ДО тире: в выдаче картинки нет, предмет называет заголовок;
 * — приложение для сотрудников идёт ПЕРЕД кассами: обратный порядок читается
 *   тем, у кого кассы нет, как список требований к нему;
 * — «Телеграм» кириллицей и БЕЗ склонения — всегда «Телеграм», не
 *   «Телеграма»/«Телеграме»: так пишет сам ресторатор, и Яндекс
 *   подсвечивает совпадение в выдаче;
 * — `keywords` не задаём: ни Яндекс, ни Google их не учитывают.
 */
export const SEO_CONFIG = {
  title: "Заказы и доставка еды в MAX и Телеграм — приложение твоего заведения",
  description:
    "Нямбот — свой канал заказов для кафе, ресторанов и пекарен: гость выбирает точку, собирает заказ в мессенджере и платит онлайн. Заказ приходит в приложение для сотрудников, есть iiko или R-Keeper — прямо в кассу. 90 дней бесплатно",
  ogImage: "/images/og-cover.png",
  ogImageAlt:
    "Нямбот — заказы и доставка еды в MAX и Телеграм: гость выбирает точку и собирает заказ в меню",
  ogImageWidth: 1200,
  ogImageHeight: 630,
} as const;

type IPageMetadataParams = {
  /** Полный заголовок страницы — подставляется как есть, без шаблона layout. */
  title: string;
  description: string;
  /** Путь от корня сайта: "/" для главной, "/legal/offer" для документа. */
  path: string;
};

/**
 * Собирает адрес страницы вместе с превью ссылки. Нужен потому, что Next
 * заменяет блоки `openGraph` и `twitter` целиком: страница, объявившая свой
 * заголовок, обязана заново перечислить картинку и остальные поля — иначе
 * они просто пропадут из разметки.
 */
export const createPageMetadata = ({
  title,
  description,
  path,
}: IPageMetadataParams): Metadata => ({
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: {
    siteName: BRAND_CONFIG.siteName,
    type: "website",
    locale: "ru_RU",
    url: path,
    title,
    description,
    images: [
      {
        url: SEO_CONFIG.ogImage,
        width: SEO_CONFIG.ogImageWidth,
        height: SEO_CONFIG.ogImageHeight,
        alt: SEO_CONFIG.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [SEO_CONFIG.ogImage],
  },
});
