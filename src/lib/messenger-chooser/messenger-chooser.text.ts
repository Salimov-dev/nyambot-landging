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
/**
 * Хвост фразы выгод — неразрывными пробелами: без `text-wrap: pretty` (старые
 * WebView) браузер оставлял «прямо в чате» одиноко на последней строке.
 */
const PITCH_TAIL = "на связи прямо в чате";

export const CHOOSER_TEXT = {
  lead: "Выбери, где тебе удобнее заказывать",
  /**
   * Чем удобен заказ в чате — одной фразой в 2–3 строки (Руслан 02.10.2026:
   * вместо трёх пунктов; «повторить заказ» убран — его в витрине нет;
   * формулировка — как на лендинге).
   * 🔴 Только утвердительно и без сравнения: рядом могут стоять сайт и
   * приложение заведения, их не принижаем. Про бонусы не пишем — программа
   * лояльности есть не у каждой точки. Без точки в конце.
   */
  pitchBothMessengers: `Меню и заказ одинаковые в MAX и Телеграм, оформление без регистрации, а заведение ${PITCH_TAIL}`,
  /** Один мессенджер рядом с сайтом или приложением: про «оба» говорить нечего. */
  pitchOneMessenger: `Оформление без регистрации, а заведение ${PITCH_TAIL}`,
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

/**
 * Подписи ярлыков «Ещё у заведения» — коротко, как под иконкой приложения на
 * телефоне. Полный текст (`CHOOSER_EXTRA_BUTTON_TEXT`) уходит в `aria-label`:
 * короткая подпись входит в него, голосовое управление находит ярлык по ней.
 */
export const CHOOSER_EXTRA_TILE_TEXT: Record<IChooserExtra, string> = {
  [CHOOSER_EXTRA.SITE]: "Сайт",
  [CHOOSER_EXTRA.APP_IOS]: "App Store",
  [CHOOSER_EXTRA.APP_ANDROID]: "Google Play",
  [CHOOSER_EXTRA.APP_RUSTORE]: "RuStore",
};
