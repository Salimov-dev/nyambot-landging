import { LINKS } from "@/config/links.config";

/**
 * Страница «Запустим твоё заведение» (`/zapusk`) и форма заявки на
 * бесплатный разбор сайта.
 *
 * Повод — разбор рекламы 28.09.2026: «Начать бесплатно» вело в СРМ на форму
 * входа, и человек, ждавший, что его запустят, уходил. Живые клиенты идут
 * путём «мы разбираем сайт — от вас только регистрация»; страница выносит его
 * на сайт. Тексты утверждены Русланом 28.09.2026.
 *
 * Заявка уходит на сервер лендинга (`src/app/api/lead/route.ts`), оттуда — на
 * main-server письмом на support@. План — `docs-nyambot/PLANS/zayavka-na-razbor-sayta-28-09-2026/`.
 */

export const ZAPUSK_PAGE = {
  path: LINKS.pages.zapusk,
  metaTitle: "Бесплатный разбор сайта и запуск в MAX и Телеграм — Нямбот",
  metaDescription:
    "Пришли сайт заведения — разберём меню, доставку и акции и соберём ботов в MAX и Телеграм. 30 дней бесплатно, ответим в течение рабочего дня",
  heading: "Сами запустим твоё заведение в MAX и Телеграм",
  lead: "Оставь заявку: разберём меню, доставку и акции и покажем, что будет у тебя в ботах. Бесплатно и без звонков.",
  stepsTitle: "Как это устроено",
  steps: [
    {
      title: "Оставляешь заявку",
      text: "Название, город и как с тобой удобнее связаться. Сайт или страницу заведения — если есть.",
    },
    {
      title: "Разбираем заведение",
      text: "Меню и фото, доставку, акции и бизнес-ланчи, кассу и оплату. Присылаем, что возьмём сами и о чём спросить.",
    },
    {
      title: "Регистрируешься",
      text: "Пара минут: по почте, карта не нужна. В кабинете СРМ появятся твои боты, меню и заказы.",
      /** Ссылкой прямо в плитке: без неё было непонятно, где это сделать */
      link: { label: "Зарегистрироваться", href: LINKS.crmRegister },
    },
    {
      title: "Собираем ботов",
      text: "Меню с твоими фото, доставку, акции; подключаем iiko или R-Keeper и приём оплаты.",
    },
    {
      title: "Проверяем запуск",
      text: "Перед приходом гостей проверяем все настройки: подтверждаем запуск или подсказываем, что донастроить.",
    },
    {
      title: "30 дней бесплатно",
      text: "Смотришь на живых заказах, нужен ли канал. Дальше меню и акции ведёшь сам — поддержка и ИИ-ассистент подскажут.",
    },
  ],
  replyPromise: "Ответим в течение рабочего дня.",
  selfServe: "Хочешь сам?",
  selfServeLink: "Зарегистрироваться",
} as const;

/** Поля формы — имена совпадают с телом `POST /api/leads/site-review`. */
export const LEAD_FIELD = {
  VENUE: "venue",
  CITY: "city",
  SITE: "site",
  NAME: "name",
  EMAIL: "email",
  TELEGRAM: "telegram",
  MAX: "max",
  COMMENT: "comment",
} as const;

export type LeadField = (typeof LEAD_FIELD)[keyof typeof LEAD_FIELD];

/**
 * Вопросы с вариантами — то, от чего зависит маршрут подключения
 * (`docs-nyambot/podklyuchenie/tipy/`). Значения совпадают с
 * `config/leads/site-review-lead.config.ts` main-server.
 */
export const LEAD_CHOICE = {
  POS: "pos",
  OUTLETS: "outlets",
  PAYMENT: "payment",
} as const;

export type LeadChoice = (typeof LEAD_CHOICE)[keyof typeof LEAD_CHOICE];

export const LEAD_CHOICE_QUESTIONS: ReadonlyArray<{
  name: LeadChoice;
  title: string;
  options: ReadonlyArray<{ value: string; label: string }>;
}> = [
  {
    name: LEAD_CHOICE.POS,
    title: "Какая у тебя касса",
    options: [
      { value: "iiko", label: "iiko" },
      { value: "rkeeper", label: "R-Keeper" },
      { value: "other", label: "Другая" },
      { value: "none", label: "Нет кассы" },
      { value: "unknown", label: "Не знаю" },
    ],
  },
  {
    name: LEAD_CHOICE.OUTLETS,
    title: "Сколько точек",
    options: [
      { value: "one", label: "Одна" },
      { value: "few", label: "2–5" },
      { value: "many", label: "6 и больше" },
    ],
  },
  {
    name: LEAD_CHOICE.PAYMENT,
    title: "Как принимаешь онлайн-оплату",
    options: [
      { value: "yookassa", label: "ЮKassa" },
      { value: "yandexPay", label: "Яндекс Пэй" },
      { value: "otherBank", label: "Другой банк" },
      { value: "none", label: "Пока не принимаю" },
    ],
  },
];

/** Что у заведения уже есть — флажками, можно несколько. */
export const LEAD_HAVE_QUESTION = {
  title: "Что уже есть — можно несколько",
  options: [
    { value: "telegramBot", label: "Свой бот в Телеграм" },
    { value: "orderService", label: "Другой сервис заказов" },
    { value: "app", label: "Своё приложение" },
    { value: "nothing", label: "Пока ничего" },
  ],
} as const;

export const LEAD_FORM_TEXT = {
  title: "Заявка на бесплатный разбор",
  venueLabel: "Название заведения",
  venueHint: "например, Ромашка",
  cityLabel: "Город",
  cityHint: "например, Казань",
  siteLabel: "Сайт или страница заведения",
  siteHint: "сайт, ВКонтакте или Телеграм-канал",
  nameLabel: "Как тебя зовут",
  nameHint: "Имя",
  contactsTitle: "Как с тобой связаться — выбери удобное, можно несколько",
  emailLabel: "Почта",
  emailHint: "name@mail.ru",
  telegramLabel: "Телеграм",
  telegramHint: "ник или номер телефона",
  maxLabel: "MAX",
  maxHint: "номер телефона",
  optionalTitle: "Необязательно, но ускорит разбор",
  commentLabel: "Комментарий",
  commentHint:
    "Всё, что поможет разбору — например, к какому сервису сейчас подключён бот",
  consentBefore: "Согласен на обработку персональных данных по ",
  consentLink: "политике",
  submit: "Получить разбор",
  sending: "Отправляем…",
  successTitle: "Спасибо!",
  successText: "Заявка у нас — разберём сайт и ответим в течение рабочего дня.",
  errorBefore:
    "Не получилось отправить. Попробуй ещё раз или напиши нам в Телеграм: ",
  errorSupport: "@nyambot_support",
  rateLimited: "Слишком много заявок подряд — попробуй через минуту",
} as const;

/** Над серой кнопкой — первое, чего не хватает (правило «серая кнопка говорит, что сделать»). */
export const LEAD_MISSING_TEXT = {
  venue: "Укажи название заведения",
  city: "Укажи город",
  name: "Напиши, как тебя зовут",
  contact: "Оставь хотя бы один способ связи",
  consent: "Отметь согласие на обработку данных",
} as const;

/** Коды отказа main-server (`config/leads/site-review-lead.config.ts`). */
export const LEAD_ERROR_CODE = {
  INVALID_SITE: "invalid_site",
  INVALID_EMAIL: "invalid_email",
  INVALID_TELEGRAM: "invalid_telegram",
  INVALID_MAX: "invalid_max",
  RATE_LIMITED: "rate_limited",
} as const;

/** Ошибка формата — под своим полем. */
export const LEAD_FIELD_ERROR: Partial<
  Record<string, { field: LeadField; text: string }>
> = {
  [LEAD_ERROR_CODE.INVALID_SITE]: {
    field: LEAD_FIELD.SITE,
    text: "Проверь ссылку — например, mycafe.ru или vk.com/mycafe",
  },
  [LEAD_ERROR_CODE.INVALID_EMAIL]: {
    field: LEAD_FIELD.EMAIL,
    text: "Проверь почту",
  },
  [LEAD_ERROR_CODE.INVALID_TELEGRAM]: {
    field: LEAD_FIELD.TELEGRAM,
    text: "Проверь ник или номер телефона",
  },
  [LEAD_ERROR_CODE.INVALID_MAX]: {
    field: LEAD_FIELD.MAX,
    text: "Проверь номер телефона",
  },
};

/** Путь формы на сервере лендинга и заявки на main-server. */
export const LEAD_API = {
  LANDING_ROUTE: "/api/lead",
  MAIN_SERVER_PATH: "/api/leads/site-review",
  /** Не короче серверного: заявка ждёт отправку письма по SMTP. */
  TIMEOUT_MS: 30_000,
} as const;
