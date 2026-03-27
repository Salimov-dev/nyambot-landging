// ============================================
// Яндекс.Метрика — для подключения в будущем
// Установить YANDEX_METRIKA_ID в env и здесь
// ============================================

export const ANALYTICS_CONFIG = {
  // Номер счётчика Яндекс.Метрики. null — отключить.
  yandexMetrikaId: process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID ?? null,

  // Параметры счётчика
  yandexMetrikaOptions: {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  },
} as const;
