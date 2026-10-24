import { ANALYTICS_CONFIG } from "./analytics.config";

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}

/** Идентификаторы целей Яндекс.Метрики */
export type MetrikaGoal =
  // Конверсии: кнопка «Запустим за тебя бесплатно» и заявка на запуск.
  // Саморегистрация скрыта (17.10.2026) — цели регистрации, первого заказа и
  // оплаты лендинг не шлёт.
  | "click_trial"
  /** Заявка на запуск ушла — только после ответа сервера «принято».
   *  🔴 Имя не менять: на цель опираются кампании Директа */
  | "lead_form"
  /** Вход в СРМ действующего клиента (шапка, подвал) — НЕ конверсия: раньше
   *  слал `click_trial` и засчитывался бы в Директе как заявка (17.10.2026) */
  | "click_crm_login"
  // Навигация / интерес к разделам
  | "click_features"
  | "scroll_features"
  | "scroll_pricing"
  /** Уход на вынесенную страницу: параметр page — какая именно */
  | "click_solution"
  // Глубина просмотра страницы
  | "scroll_25"
  | "scroll_50"
  | "scroll_75"
  | "scroll_100"
  // Демо-боты
  | "click_max_demo"
  | "click_tg_bot"
  /** Демо-QR на лендинге открыт кнопкой или нажатием на картинку, а не
   *  сканом — скан приходит на `/demo` с `utm_campaign=demo_qr` */
  | "open_demo_chooser"
  /** Общий QR-код демо (`/demo`): гость выбрал мессенджер */
  | "click_qr_demo_max"
  | "click_qr_demo_tg"
  // Поддержка
  | "click_tg_support"
  | "click_max_support"
  | "click_email_support"
  /** Открыта плавающая кнопка связи (план аудита Гуляша, С7) */
  | "open_contact_widget"
  // Соцсети
  | "click_social_telegram"
  | "click_social_rutube"
  | "click_social_vk"
  | "click_social_youtube"
  | "click_social_ok"
  | "click_social_max"
  | "click_social_dzen";

/** Отправить цель в Яндекс.Метрику */
export function reachGoal(goal: MetrikaGoal, params?: Record<string, unknown>) {
  const id = ANALYTICS_CONFIG.yandexMetrikaId;
  if (typeof window !== "undefined" && window.ym && id) {
    window.ym(Number(id), "reachGoal", goal, params);
  }
}
