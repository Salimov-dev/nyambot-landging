import { BRAND_CONFIG } from "@/config/brand.config";
import {
  buildTrackedUrl,
  DEMO_START_SOURCE,
  readUtmFromSearch,
  UTM_CAMPAIGN,
  UTM_CLIENT,
  UTM_MEDIUM,
  UTM_SOURCE,
  type DemoStartSource,
} from "@/shared/utm-rules/utm-rules.shared";

/**
 * Метки страницы выбора мессенджера (план «UTM-метки», Ф2 и Ф4).
 *
 * Подпись «Работает на Нямботе» видит гость заведения — ровно тот, кто может
 * оказаться ресторатором. Без меток его переход Метрика записывала прямым
 * заходом. Метка клиента — адрес QR-кода: он и есть заведение на этой странице.
 */

/** Подпись на странице заведения `/go/<адрес>`. */
export const qrPagePoweredByUrl = (slug: string): string =>
  buildTrackedUrl(BRAND_CONFIG.siteUrl, {
    source: UTM_SOURCE.QR_PAGE,
    medium: UTM_MEDIUM.POWERED_BY,
    campaign: UTM_CAMPAIGN.CHOOSER,
    content: UTM_CLIENT.qr(slug),
  });

/** Подпись на странице демо `/demo`. */
export const demoPagePoweredByUrl = (): string =>
  buildTrackedUrl(BRAND_CONFIG.siteUrl, {
    source: UTM_SOURCE.DEMO_PAGE,
    medium: UTM_MEDIUM.POWERED_BY,
    campaign: UTM_CAMPAIGN.CHOOSER,
  });

/**
 * Откуда нажали «Старт» в демо-боте, открытом со страницы `/demo`: скан
 * демо-QR приносит метку `utm_campaign=demo_qr` (адрес зашит в картинку
 * скриптом `workspace-scripts/scripts/build-demo-qr.mjs`), всё остальное —
 * сама страница.
 */
export const demoStartSourceFromUrl = (requestUrl: string): DemoStartSource => {
  const marks = readUtmFromSearch(new URL(requestUrl).search);
  return marks?.campaign === UTM_CAMPAIGN.DEMO_QR
    ? DEMO_START_SOURCE.DEMO_QR
    : DEMO_START_SOURCE.DEMO_PAGE;
};
