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
    telegram: "https://t.me/kusochek_demo_bot",
    max: "https://max.ru/id183401217970_bot",
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
    /** Бесплатный разбор сайта и запуск — куда ведёт «Начать бесплатно» */
    zapusk: "/zapusk",
  },

  legal: {
    privacy: "/legal/privacy",
    terms: "/legal/terms",
    offer: "/legal/offer",
    cookies: "/legal/cookies",
    tariffs: "/legal/tariffs",
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
