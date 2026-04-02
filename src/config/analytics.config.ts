// ============================================
// Яндекс.Метрика — счётчик 108360687
// ============================================

export const ANALYTICS_CONFIG = {
  // Номер счётчика Яндекс.Метрики. null — отключить.
  yandexMetrikaId: process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID ?? null,

  // Параметры счётчика
  yandexMetrikaOptions: {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: "dataLayer",
    accurateTrackBounce: true,
    trackLinks: true,
  },
} as const;
