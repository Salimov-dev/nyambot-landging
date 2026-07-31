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
    default: `${BRAND_CONFIG.name} — один бот на всю сеть: заказы и доставка еды в MAX и Telegram`,
    template: `%s | ${BRAND_CONFIG.name}`,
  },
  description:
    "Сервис для общепита: один бот на всю сеть и одна база гостей в MAX и Telegram. Гость выбирает точку и заказывает у тебя напрямую, история заказов и баллы у него общие в двух мессенджерах, у каждой точки своё меню и зона доставки. Без отдельного бота на каждую точку и без комиссии агрегаторов. CRM и приложение «Команда», iiko и R-Keeper, онлайн-оплата, Яндекс.Доставка. 90 дней бесплатно",
  keywords: [
    "Нямбот",
    "один бот на всю сеть",
    "один бот на несколько точек",
    "единая база гостей сети",
    "общие баллы во всех точках",
    "один бот в MAX и Telegram",
    "бот для сети кофеен",
    "бот для франшизы общепита",
    "свой канал заказов и доставки",
    "приём заказов в мессенджере",
    "бот для общепита",
    "бот для сети заведений",
    "бот для доставки еды",
    "ресторан Telegram бот",
    "кафе Telegram бот",
    "пекарня Telegram бот",
    "дарк-китчен приём заказов",
    "MAX бот для заведения",
    "мини-приложение для общепита",
    "мини-приложение для кафе",
    "CRM для общепита",
    "CRM для заведения",
    "собственный канал продаж ресторан",
    "повторные заказы без комиссии",
    "онлайн-оплата заказов в ресторане",
    "один бот на сеть точек",
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
    title: `${BRAND_CONFIG.name} — один бот на всю сеть: заказы и доставка еды в MAX и Telegram`,
    description:
      "Один бот на всю сеть и одна база гостей в MAX и Telegram: гость заказывает у тебя напрямую, история и баллы общие в двух мессенджерах, iiko и R-Keeper, оплата и Яндекс.Доставка",
    images: [
      {
        url: "/images/nyambot_logo_square.png",
        width: 512,
        height: 512,
        alt: "Нямбот — один бот на всю сеть: заказы и доставка еды в MAX и Telegram",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${BRAND_CONFIG.name} — один бот на всю сеть: заказы и доставка еды в MAX и Telegram`,
    description:
      "Один бот на всю сеть и одна база гостей в MAX и Telegram: гость заказывает у тебя напрямую, история и баллы общие в двух мессенджерах.",
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
