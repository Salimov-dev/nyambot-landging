import {
  CHOOSER_MESSENGER,
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
