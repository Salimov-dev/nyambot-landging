import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "@/providers/providers";
import { YandexMetrika } from "@/components/ui/analytics/yandex-metrika";
import { StructuredData } from "@/components/common/structured-data/structured-data";
import { geistSans, geistMono } from "@/lib/fonts";
import { BRAND_CONFIG } from "@/config/brand.config";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${BRAND_CONFIG.name} — вся сеть в одном канале MAX и Telegram`,
    template: `%s | ${BRAND_CONFIG.name}`,
  },
  description:
    "Один бот в MAX и Telegram на всю сеть точек: своя база клиентов, повторные заказы без комиссии агрегатора, CRM, приложение «Команда», интеграция с iiko и R-Keeper, доставка через Яндекс.Доставку. 90 дней бесплатно.",
  keywords: [
    "Нямбот",
    "один бот на сеть точек",
    "бот для сети ресторанов",
    "ресторан Telegram бот",
    "кафе Telegram бот",
    "MAX бот ресторан",
    "мини-приложение для ресторана",
    "мини-приложение для кафе",
    "CRM для ресторана",
    "CRM для заведения",
    "собственный канал продаж ресторан",
    "повторные заказы без комиссии",
    "приём заказов в мессенджере",
    "iiko интеграция",
    "R-Keeper интеграция",
    "Яндекс.Доставка для ресторана",
    "доставка без своего штата курьеров",
    "приложение для администратора и курьера",
  ],
  metadataBase: new URL(BRAND_CONFIG.siteUrl),
  openGraph: {
    siteName: BRAND_CONFIG.siteName,
    type: "website",
    locale: "ru_RU",
    url: BRAND_CONFIG.siteUrl,
    title: `${BRAND_CONFIG.name} — вся сеть в одном канале MAX и Telegram`,
    description:
      "Веди всю сеть через один канал в MAX и Telegram, работай со своими клиентами напрямую — без комиссии с чека. CRM, приложение «Команда», iiko и R-Keeper, доставка через Яндекс.Доставку. 90 дней бесплатно.",
    images: [
      {
        url: "/images/nyambot_logo_square.png",
        width: 512,
        height: 512,
        alt: "Нямбот — вся сеть в одном канале MAX и Telegram",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${BRAND_CONFIG.name} — вся сеть в одном канале MAX и Telegram`,
    description:
      "Один канал в MAX и Telegram на всю сеть. Свои клиенты, своя маржа, без комиссии агрегатора.",
    images: ["/images/nyambot_logo_square.png"],
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
