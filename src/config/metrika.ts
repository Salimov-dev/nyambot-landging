import { ANALYTICS_CONFIG } from "./analytics.config";

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}

/** Идентификаторы целей Яндекс.Метрики */
export type MetrikaGoal =
  | "click_trial"
  | "click_features"
  | "click_pricing"
  | "scroll_pricing"
  | "scroll_features"
  | "click_tg_support"
  | "click_tg_bot"
  | "click_max_demo"
  | "click_max_support"
  | "registration"
  | "first_order"
  | "payment"
  | "click_email_support"
  | "click_social_telegram"
  | "click_social_rutube"
  | "click_social_vk"
  | "click_social_youtube"
  | "click_social_ok"
  | "click_social_max"
  | "video_play"
  | "scroll_video";

/** Отправить цель в Яндекс.Метрику */
export function reachGoal(goal: MetrikaGoal, params?: Record<string, unknown>) {
  const id = ANALYTICS_CONFIG.yandexMetrikaId;
  if (typeof window !== "undefined" && window.ym && id) {
    window.ym(Number(id), "reachGoal", goal, params);
  }
}
