import {
  buildDemoBotLink,
  DEMO_START_SOURCE,
} from "@/shared/utm-rules/utm-rules.shared";

/** Демо-боты «Кусочка» — голые ссылки; по сайту ходят только с источником. */
const DEMO_BOTS = {
  telegram: "https://t.me/kusochek_demo_bot",
  max: "https://max.ru/id183401217970_bot",
} as const;

export const LINKS = {
  crm: "https://crm.nyambot.ru",
  /** СРМ сразу на регистрации — для кнопок, которые обещают «зарегистрироваться»:
   *  обычная ссылка открывает форму ВХОДА, и новичок с неё уходил. */
  crmRegister: "https://crm.nyambot.ru/login?mode=register",
  crew: "https://crew.nyambot.ru",
  docs: "https://guide.nyambot.ru",
  /** Логотип участника проекта обязан вести на сайт Фонда (Положение № 165-Пр, ст. 4) */
  skolkovo: "https://sk.ru",
  support: {
    telegram: "https://t.me/nyambot_support",
    email: "mailto:support@nyambot.ru",
    /** Профиль поддержки в MAX (ссылка «Поделиться» из приложения, Руслан 28.09.2026). */
    max: "https://max.ru/u/f9LHodD0cOIEY0GDPfsGpWhJb0oMXHpqNWIh2EfxTGCwHvC648GiAWyHL0A",
  },

  demo: {
    ...DEMO_BOTS,
    /** Кнопки демо на лендинге и посадочных: бот считает «Старт» по источнику
     *  `?start=src_landing` (план «UTM-метки», Ф4). */
    fromLanding: {
      telegram: buildDemoBotLink(DEMO_BOTS.telegram, DEMO_START_SOURCE.LANDING),
      max: buildDemoBotLink(DEMO_BOTS.max, DEMO_START_SOURCE.LANDING),
    },
    /** Общий QR-код демо: страница выбора «MAX или Телеграм» — та же, что у
     *  заведений на Нямботе (`/go/<адрес>`). */
    chooser: "/demo",
  },

  /** Посадочные страницы под поисковые запросы (тексты — landing-pages.config) */
  pages: {
    iiko: "/iiko",
    rkeeper: "/rkeeper",
    /** Все интеграции разом: кассы, оплата, доставка */
    integrations: "/integracii",
    messengers: "/zakazy-v-max-i-telegram",
    features: "/vozmozhnosti",
    faq: "/voprosy",
    network: "/set-i-franshiza",
    ownChannels: "/sayt-ili-prilozhenie",
    security: "/bezopasnost",
    /** Заявка на запуск — куда ведёт «Запустим за тебя бесплатно» */
    zapusk: "/zapusk",
    /** Один QR-код на MAX и Телеграм — посадочная под рекламу */
    qrCode: "/odin-qr-kod",
    /** Витрина и страница QR-кода в цветах заведения — лого и цветовая схема бренда */
    branding: "/brendirovanie",
    /** Приложение «Команда»: админ смены, повар, свои курьеры, Яндекс.Доставка */
    komanda: "/komanda",
    /** Лояльность Нямбота: баллы, акции, промокоды, подарки, предложение дня */
    loyalty: "/loyalnost",
  },

  legal: {
    privacy: "/legal/privacy",
    terms: "/legal/terms",
    offer: "/legal/offer",
    cookies: "/legal/cookies",
    tariffs: "/legal/tariffs",
    /** Согласие на обработку ПДн при отправке заявки на запуск */
    briefConsent: "/legal/brief-consent",
    /** Согласие на обработку ПДн пользователя СРМ — галочка регистрации */
    crmConsent: "/legal/crm-consent",
  },

  social: {
    telegram: "https://t.me/nyambot_ru",
    max: "https://max.ru/id183401217970_biz",
    rutube: "https://rutube.ru/channel/28468267/",
    vk: "https://vk.com/nyambot_ru",
    youtube: "https://www.youtube.com/@nyambot_ru",
    ok: "https://ok.ru/group/70000051407337",
    dzen: "https://dzen.ru/nyambot",
  },
} as const;
