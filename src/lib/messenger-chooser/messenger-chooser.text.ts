import {
  CHOOSER_EXTRA,
  CHOOSER_MESSENGER,
  type IChooserExtra,
  type IChooserMessenger,
} from "./messenger-chooser.types";

/**
 * Тексты страницы выбора мессенджера. Её видит ГОСТЬ заведения, а не
 * ресторатор: на «ты», коротко, без слов «бот», «Нямбот» и «QR» в заголовках —
 * гость пришёл за меню, а не за технологией.
 *
 * Русские, без i18next: страница — голый HTML с сервера, до языка клиента дело
 * не доходит, а заведения работают в России.
 */
export const CHOOSER_TEXT = {
  lead: "Выбери, где тебе удобнее заказывать",
  sameEverywhere: "Меню и заказ одинаковые в обоих мессенджерах",
  /**
   * Чем удобен заказ в чате. 🔴 Только утвердительно и без сравнения: рядом
   * могут стоять сайт и приложение заведения, их не принижаем. Про бонусы не
   * пишем — программа лояльности есть не у каждой точки.
   */
  benefits: [
    "Статус заказа приходит сообщением в чат",
    "Повторить прошлый заказ — в пару касаний",
    "Новости и акции заведения — в том же чате",
  ],
  extrasTitle: "Ещё у заведения",
  lastChoice: "В прошлый раз",
  single: "Открываем мессенджер…",
  singleFallback: "Если ничего не открылось, нажми кнопку",
  /** «Работает на Нямботе» — имя продукта фирменным цветом отдельным словом. */
  poweredByPrefix: "Работает на",
  poweredByBrand: "Нямботе",
  notFoundTitle: "Ссылка не работает",
  notFoundText: "Спроси у заведения актуальный QR-код.",
  unavailableTitle: "Страница временно недоступна",
  unavailableText: "Попробуй открыть её ещё раз через минуту.",
} as const;

export const CHOOSER_BUTTON_TEXT: Record<IChooserMessenger, string> = {
  [CHOOSER_MESSENGER.MAX]: "Открыть в MAX",
  [CHOOSER_MESSENGER.TELEGRAM]: "Открыть в Телеграм",
};

export const CHOOSER_EXTRA_BUTTON_TEXT: Record<IChooserExtra, string> = {
  [CHOOSER_EXTRA.SITE]: "Сайт заведения",
  [CHOOSER_EXTRA.APP_IOS]: "Приложение в App Store",
  [CHOOSER_EXTRA.APP_ANDROID]: "Приложение в Google Play",
  [CHOOSER_EXTRA.APP_RUSTORE]: "Приложение в RuStore",
};
