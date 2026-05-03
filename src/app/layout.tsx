import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "@/providers/providers";
import { YandexMetrika } from "@/components/ui/analytics/yandex-metrika";
import { geistSans, geistMono } from "@/lib/fonts";
import { BRAND_CONFIG } from "@/config/brand.config";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${BRAND_CONFIG.name} — Ваше заведение в МАХ и ТГ. Без агрегаторов`,
    template: `%s | ${BRAND_CONFIG.name}`,
  },
  description:
    "Всё включено: мини-приложение, CRM, приложение для админа и курьеров, акции, лояльность, промокоды, 7 языков. 0% комиссии. 7 дней бесплатно.",
  keywords: [
    "Нямбот",
    "ресторан Telegram бот",
    "доставка еды Telegram",
    "MAX бот ресторан",
    "мини-приложение для ресторана",
    "CRM для ресторана",
    "заказы без агрегаторов",
    "приём заказов в мессенджере",
    "доставка еды без комиссии",
    "замена Яндекс Еды",
    "ресторан без агрегатора",
    "курьерское приложение для ресторана",
  ],
  metadataBase: new URL(BRAND_CONFIG.siteUrl),
  openGraph: {
    siteName: BRAND_CONFIG.siteName,
    type: "website",
    locale: "ru_RU",
    url: BRAND_CONFIG.siteUrl,
    title: `${BRAND_CONFIG.name} — Ваше заведение в МАХ и ТГ. Без агрегаторов`,
    description:
      "Принимайте заказы через Telegram и MAX без агрегаторов. 0% комиссии, CRM, курьерское приложение — всё включено. 7 дней бесплатно.",
    images: [
      {
        url: "/images/nyambot_logo_square.png",
        width: 512,
        height: 512,
        alt: "Нямбот — заказы через Telegram и MAX",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${BRAND_CONFIG.name} — Ваше заведение в МАХ и ТГ`,
    description:
      "Принимайте заказы через Telegram и MAX без агрегаторов. 0% комиссии.",
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
