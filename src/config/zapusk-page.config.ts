import { LINKS } from "@/config/links.config";
import {
  BRIEF_ERROR,
  BRIEF_FIELD,
  BRIEF_ONLINE_PAYMENT,
  BRIEF_POS,
  type BriefChoiceField,
  type BriefChoiceValue,
  type BriefErrorCode,
  type BriefTextInputField,
} from "@/lib/launch-brief/launch-brief.model";
import {
  BRIEF_MISSING,
  type BriefMissing,
} from "@/lib/launch-brief/launch-brief.validation";

/**
 * Страница «Заявка на запуск» (`/zapusk`) и её форма — план
 * `docs-nyambot/features/onboarding/brif-zapuska-2026-10-09`, Ф2 (только ru, Р14).
 *
 * История: 28.09.2026 «Начать бесплатно» вело в СРМ на форму входа, и
 * человек, ждавший, что его запустят, уходил — появилась страница с заявкой
 * на разбор сайта. 09.10.2026 заявка выросла в полную «Заявку на запуск»
 * (Р5): одна форма вместо разбора, запуск делает наша команда бесплатно,
 * связываемся в течение 24 часов (Р2). На главной теперь две кнопки (Р15):
 * «Запустим за тебя бесплатно» ведёт сюда, «Настрою сам» — на регистрацию.
 *
 * 🔴 Слово «бриф» в интерфейсе не используем — только «Заявка на запуск» (Р24).
 * 🔴 Нигде не пишем «настроим ботов в MAX» (Р26): бота в Телеграм заводим мы
 * и передаём права, бота в MAX открывает сам клиент на своё ИП или ООО по
 * ссылке — мы подключаем; ЮKassa — после запуска в Телеграм. Сроков
 * запуска в днях не обещаем.
 *
 * Заявка уходит на сервер лендинга (`src/app/api/lead/route.ts`), оттуда — на
 * main-server `POST /api/leads/launch-brief` и в базу.
 */

export const ZAPUSK_PAGE = {
  path: LINKS.pages.zapusk,
  metaTitle: "Заявка на запуск — запустим за тебя бесплатно | Нямбот",
  metaDescription:
    "Расскажи о заведении — бесплатно настроим меню, кассу и доставку и заведём бота в Телеграм. Свяжемся в течение 24 часов",
  label: "Заявка на запуск",
  /** Заголовок — двумя строками (Руслан 10.10). */
  headingLines: ["Расскажи о заведении —", "запустим за тебя бесплатно"],
  selfServe: "Хочешь настроить сам?",
  selfServeLink: "Зарегистрироваться",
} as const;

/**
 * «Что будет после заявки» — под формой, шесть шагов текстом Ф0 (Руслан
 * 10.10: «распиши подробнее, как в первый раз»). Правило ботов (Р26):
 * Телеграм — мы, MAX — клиент сам по ссылке.
 */
export const ZAPUSK_AFTER = {
  title: "Что будет после заявки",
  /** Отметка у пройденного шага — после отправки отмечен первый. */
  doneMark: "✓",
  /** Для экранного диктора: шаг пройден. */
  doneLabel: " (сделано)",
  steps: [
    {
      title: "Сразу",
      text: "письмо «Заявка у нас» на почту, если ты её указал.",
    },
    {
      title: "В течение 24 часов",
      text: "свяжемся там, где тебе удобно: уточним, чего не хватает, и скажем, сколько займёт запуск — это зависит от кассы и меню.",
    },
    {
      title: "Настраиваем мы",
      text: "кабинет, точки, меню, кассу и доставку; заводим бота в Телеграм и проверяем тестовыми заказами. Пробный период в это время не тратится.",
    },
    {
      title: "Передаём тебе",
      text: "придёт письмо: задаёшь пароль, принимаешь условия и входишь в кабинет; права на бота в Телеграм передаём тебе. С этого дня — 30 дней бесплатно, все функции.",
    },
    {
      title: "MAX и онлайн-оплата",
      text: "бота в MAX открываешь ты сам на своё ИП или ООО по ссылке (business.max.ru) — мы его подключим. Платёжную систему для онлайн-оплаты подключаем после запуска в Телеграм: для проверки магазина нужен работающий бот.",
    },
    {
      title: "Дальше",
      text: "оплата по тарифу, без привязки карты и автосписаний. Несколько точек — договоримся об условиях под твою сеть.",
    },
  ],
} as const;

/**
 * Канал связи: одно поле и переключатель. MAX — раньше
 * Телеграма, как везде в продукте.
 */
export const BRIEF_CONTACT_CHANNEL = {
  PHONE: "phone",
  MAX: "max",
  TELEGRAM: "telegram",
} as const;

export type BriefContactChannel =
  (typeof BRIEF_CONTACT_CHANNEL)[keyof typeof BRIEF_CONTACT_CHANNEL];

/** В какое поле заявки ложится контакт выбранного канала. */
export const BRIEF_CONTACT_CHANNEL_FIELD = {
  [BRIEF_CONTACT_CHANNEL.PHONE]: BRIEF_FIELD.PHONE,
  [BRIEF_CONTACT_CHANNEL.MAX]: BRIEF_FIELD.MAX,
  [BRIEF_CONTACT_CHANNEL.TELEGRAM]: BRIEF_FIELD.TELEGRAM,
} as const satisfies Record<BriefContactChannel, BriefTextInputField>;

/**
 * Тексты формы. Форма — только основное (Руслан 10.10): детали выясняем в
 * диалоге, остальное оператор заполняет в карточке админки.
 */
export const BRIEF_FORM_TEXT = {
  /** Одно поле контакта и переключатель канала. */
  contactLabel: "Как с тобой связаться",
  /** Метка обязательного поля рядом с подписью. */
  requiredMark: "*",
  draftRestored: "Продолжаем с того места, где ты остановился",
  draftReset: "Начать заново",
  submit: "Отправить заявку",
  sending: "Отправляем…",
  replyPromise: "Свяжемся в течение 24 часов",
  successTitle: "Спасибо!",
  successText: "Заявка у нас — свяжемся в течение 24 часов",
  consentBefore: "Даю согласие на обработку персональных данных на условиях ",
  consentLink: "Согласия",
  consentMiddle: " и ",
  consentPolicyLink: "Политики обработки персональных данных",
  errorBefore:
    "Не получилось отправить. Попробуй ещё раз или напиши нам в Телеграм: ",
  errorSupport: "@nyambot_support",
  rateLimited: "Слишком много заявок подряд — попробуй через минуту",
} as const;

type InputCopy = {
  label: string;
  /** Пример в пустом поле. */
  hint?: string;
};

export const BRIEF_INPUT_TEXT: Record<BriefTextInputField, InputCopy> = {
  [BRIEF_FIELD.NAME]: { label: "Как тебя зовут", hint: "Имя" },
  [BRIEF_FIELD.EMAIL]: { label: "Почта", hint: "name@mail.ru" },
  [BRIEF_FIELD.PHONE]: { label: "Телефон", hint: "+7 (999) 123-45-67" },
  [BRIEF_FIELD.MAX]: { label: "MAX", hint: "номер или ссылка" },
  [BRIEF_FIELD.TELEGRAM]: {
    label: "Телеграм",
    hint: "ник или номер телефона",
  },
  [BRIEF_FIELD.VENUE]: { label: "Название заведения", hint: "Название" },
  [BRIEF_FIELD.SITE]: {
    label: "Сайт или страница заведения",
    hint: "Сайт, группа, канал",
  },
  [BRIEF_FIELD.OUTLETS_TOTAL]: { label: "Сколько точек", hint: "2–5" },
  [BRIEF_FIELD.COMMENT]: {
    label: "Комментарий",
    hint: "Если хочешь что-то добавить",
  },
};

type Option<TValue extends string> = { value: TValue; label: string };

/** Вопросы с одним ответом — значения ровно enum main-server. */
export const BRIEF_CHOICE_QUESTION: {
  [TField in BriefChoiceField]: {
    label: string;
    options: ReadonlyArray<Option<BriefChoiceValue<TField>>>;
  };
} = {
  [BRIEF_FIELD.POS]: {
    label: "Какая у тебя касса",
    options: [
      { value: BRIEF_POS.IIKO, label: "iiko" },
      { value: BRIEF_POS.RKEEPER, label: "R-Keeper" },
      { value: BRIEF_POS.OTHER, label: "Другая" },
      { value: BRIEF_POS.NONE, label: "Нет кассы" },
      { value: BRIEF_POS.UNKNOWN, label: "Не знаю" },
    ],
  },
  [BRIEF_FIELD.ONLINE_PAYMENT]: {
    label: "Платёжная система",
    options: [
      { value: BRIEF_ONLINE_PAYMENT.YOOKASSA, label: "ЮKassa" },
      { value: BRIEF_ONLINE_PAYMENT.YANDEX_PAY, label: "Яндекс Пэй" },
      { value: BRIEF_ONLINE_PAYMENT.OTHER_BANK, label: "Другой банк" },
      { value: BRIEF_ONLINE_PAYMENT.NONE, label: "Пока нет" },
    ],
  },
};

/** Над серой кнопкой — первое, чего не хватает (правило «серая кнопка говорит, что сделать»). */
export const BRIEF_MISSING_TEXT: Record<BriefMissing, string> = {
  [BRIEF_MISSING.NAME]: "Напиши, как тебя зовут",
  [BRIEF_MISSING.CONTACT]: "Оставь телефон, MAX или Телеграм",
  [BRIEF_MISSING.VENUE]: "Укажи название заведения",
  [BRIEF_MISSING.POS]: "Выбери кассу — или «Не знаю»",
  [BRIEF_MISSING.CONSENT]: "Отметь согласие на обработку данных",
};

/** Где показать ошибку: под полем, под полем контакта или у галочки. */
export const BRIEF_ERROR_TARGET = {
  NAME: "name",
  EMAIL: "email",
  CONTACT: "contact",
  PHONE: "phone",
  MAX: "max",
  TELEGRAM: "telegram",
  VENUE: "venue",
  SITE: "site",
  OUTLETS: "outlets",
  POS: "pos",
  CONSENT: "consent",
} as const;

export type BriefErrorTarget =
  (typeof BRIEF_ERROR_TARGET)[keyof typeof BRIEF_ERROR_TARGET];

/**
 * Код отказа (проверка в браузере или ответ main-server) → текст под полем.
 * Чего здесь нет, показывается общей ошибкой у кнопки.
 */
export const BRIEF_FIELD_ERROR: Partial<
  Record<BriefErrorCode, { target: BriefErrorTarget; text: string }>
> = {
  [BRIEF_ERROR.NAME_REQUIRED]: {
    target: BRIEF_ERROR_TARGET.NAME,
    text: "Напиши имя — без ссылок",
  },
  [BRIEF_ERROR.CONTACT_REQUIRED]: {
    target: BRIEF_ERROR_TARGET.CONTACT,
    text: BRIEF_MISSING_TEXT[BRIEF_MISSING.CONTACT],
  },
  [BRIEF_ERROR.INVALID_PHONE]: {
    target: BRIEF_ERROR_TARGET.PHONE,
    text: "Проверь номер — нужно не меньше 10 цифр",
  },
  [BRIEF_ERROR.INVALID_TELEGRAM]: {
    target: BRIEF_ERROR_TARGET.TELEGRAM,
    text: "Проверь ник или номер телефона",
  },
  [BRIEF_ERROR.INVALID_MAX]: {
    target: BRIEF_ERROR_TARGET.MAX,
    text: "Проверь номер телефона или ссылку max.ru",
  },
  [BRIEF_ERROR.INVALID_EMAIL]: {
    target: BRIEF_ERROR_TARGET.EMAIL,
    text: "Проверь почту",
  },
  [BRIEF_ERROR.VENUE_REQUIRED]: {
    target: BRIEF_ERROR_TARGET.VENUE,
    text: BRIEF_MISSING_TEXT[BRIEF_MISSING.VENUE],
  },
  [BRIEF_ERROR.INVALID_SITE]: {
    target: BRIEF_ERROR_TARGET.SITE,
    text: "Проверь ссылку — например, mycafe.ru или vk.com/mycafe",
  },
  [BRIEF_ERROR.INVALID_OUTLETS]: {
    target: BRIEF_ERROR_TARGET.OUTLETS,
    text: "Точек — целое число от 1 до 1000",
  },
  [BRIEF_ERROR.POS_REQUIRED]: {
    target: BRIEF_ERROR_TARGET.POS,
    text: BRIEF_MISSING_TEXT[BRIEF_MISSING.POS],
  },
  [BRIEF_ERROR.CONSENT_REQUIRED]: {
    target: BRIEF_ERROR_TARGET.CONSENT,
    text: BRIEF_MISSING_TEXT[BRIEF_MISSING.CONSENT],
  },
};

/** Путь формы на сервере лендинга и заявки на main-server. */
export const LEAD_API = {
  LANDING_ROUTE: "/api/lead",
  MAIN_SERVER_PATH: "/api/leads/launch-brief",
  /** Не короче серверного: заявка ждёт запись в базу и отправку писем. */
  TIMEOUT_MS: 30_000,
} as const;
