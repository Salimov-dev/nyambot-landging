/**
 * Блок «Работа с залом» на главной (план «Работа с залом», Ф10б п. 1).
 *
 * 🔴 Ролика пока нет — он отдельная задача (Ф10б п. 6, раскадровка в
 * docs-nyambot/marketing/video/roliki/glavnaya/zal). До него место ролика
 * занимает статичный экран телефона — бот за столом (`HallPhoneScreen`), а не
 * пустая рамка. Когда ролик соберётся, сюда встанут `src`, `poster` и шаги с
 * секундами по пунктам ниже — как в `komanda-video.config.ts`, а экран телефона
 * станет постером.
 */

/** Пункты блока — в порядке пути гостя: стол → подача → бронь → ко времени */
export const HallPoint = {
  table: "table",
  serve: "serve",
  booking: "booking",
  scheduled: "scheduled",
} as const;
export type HallPoint = (typeof HallPoint)[keyof typeof HallPoint];

export const HALL_POINTS: readonly HallPoint[] = Object.values(HallPoint);

/**
 * Экран бота за столом — те же слова, что пишет бот гостю (bot-nyambot,
 * `messages.enum.ts` → `tableVisit.greetingBoth` и кнопки). Это картинка
 * продукта, а не текст лендинга: бот говорит по-русски на любом языке
 * страницы, поэтому строки живут здесь, а не в локалях.
 */
export const HALL_SCREEN_TEXT = {
  botName: "Кусочек",
  botLabel: "бот",
  greeting:
    "🍽 Ты за столом 12 в «Кусочек». Закажи здесь — официант принесёт или заберёшь сам, выберешь при оформлении",
  menuButton: "Открыть меню",
  callWaiterButton: "Позвать официанта",
  askBillButton: "Попросить счёт",
  inputPlaceholder: "Сообщение",
} as const;
