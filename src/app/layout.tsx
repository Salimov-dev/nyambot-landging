import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "@/providers/providers";
import { YandexMetrika } from "@/components/ui/analytics/yandex-metrika";
import { StructuredData } from "@/components/common/structured-data/structured-data";
import { geistSans, geistMono } from "@/lib/fonts";
import { BRAND_CONFIG } from "@/config/brand.config";
import "./globals.css";

/** Заголовок и описание держим в пределах того, что показывают выдачи:
 *  title ≈ 70 символов, description ≈ 230 — длинный текст всё равно
 *  обрезается, а обрезанный теряет УТП в середине. */
const PAGE_TITLE = `${BRAND_CONFIG.name} — один бот на всю сеть в MAX и Telegram`;
const PAGE_DESCRIPTION =
  "Один бот на все точки сети и одна база гостей в MAX и Telegram. Гость заказывает без регистрации. Работает с iiko и R-Keeper — и совсем без кассы. Регистрация по почте, 90 дней бесплатно, без карты";
const OG_IMAGE = "/images/og-cover.png";

export const metadata: Metadata = {
  title: {
    default: PAGE_TITLE,
    template: `%s | ${BRAND_CONFIG.name}`,
  },
  description: PAGE_DESCRIPTION,
  keywords: [
    "Нямбот",
    "один бот на всю сеть",
    "единая база гостей сети",
    "бот для общепита",
    "бот для доставки еды",
    "мини-приложение для кафе без регистрации",
    "CRM для общепита",
    "приём заказов в мессенджере",
    "MAX бот для заведения",
    "iiko интеграция",
    "R-Keeper интеграция",
    "доставка без своего штата курьеров",
  ],
  metadataBase: new URL(BRAND_CONFIG.siteUrl),
  alternates: {
    canonical: BRAND_CONFIG.siteUrl,
  },
  openGraph: {
    siteName: BRAND_CONFIG.siteName,
    type: "website",
    locale: "ru_RU",
    url: BRAND_CONFIG.siteUrl,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Нямбот — один бот на всю сеть: заказы и доставка еды в MAX и Telegram",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: {
    icon: "/images/nyambot_logo.png",
    shortcut: "/images/nyambot_logo.png",
    apple: "/images/nyambot_logo_square.png",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <StructuredData />
        <script
          dangerouslySetInnerHTML={{
            __html: `if ("scrollRestoration" in history) { history.scrollRestoration = "manual"; } window.scrollTo(0, 0);`,
          }}
        />
      </head>
      <body>
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
        <YandexMetrika />
      </body>
    </html>
  );
}
