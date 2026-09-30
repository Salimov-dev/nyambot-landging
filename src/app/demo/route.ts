import { ANALYTICS_CONFIG } from "@/config/analytics.config";
import { LINKS } from "@/config/links.config";
import type { MetrikaGoal } from "@/config/metrika";
import { htmlResponse } from "@/lib/messenger-chooser/chooser-response";
import {
  demoPagePoweredByUrl,
  demoStartSourceFromUrl,
} from "@/lib/messenger-chooser/chooser-tracking";
import { DEMO_LOGO_DATA_URI } from "@/lib/messenger-chooser/demo-logo.generated";
import { renderChooserPage } from "@/lib/messenger-chooser/messenger-chooser.page";
import {
  CHOOSER_MESSENGER,
  type IChooserMessenger,
} from "@/lib/messenger-chooser/messenger-chooser.types";
import { buildDemoBotLink } from "@/shared/utm-rules/utm-rules.shared";

/**
 * Общий QR-код демо-бота: `nyambot.ru/demo` — та же страница выбора, что
 * видит гость заведения по `nyambot.ru/go/<адрес>`. Ссылки берутся из
 * конфига, а не из базы: демо на лендинге не должно зависеть от записи в СРМ.
 *
 * В отличие от страницы заведения, здесь есть Метрика Нямбота: это наша
 * страница и наш посетитель.
 */

const DEMO_TITLE = "Демо Нямбота — кафе «Кусочек»";

/**
 * Лого «Кусочка» на странице демо (план «Брендирование», Ф6). Цвета — Нямбота:
 * бренд «Кусочка» на проде остаётся в цветах Нямбота (Руслан 30.09), страница
 * и витрина демо должны совпадать.
 */

const DEMO_GOALS: Record<IChooserMessenger, MetrikaGoal> = {
  [CHOOSER_MESSENGER.MAX]: "click_qr_demo_max",
  [CHOOSER_MESSENGER.TELEGRAM]: "click_qr_demo_tg",
};

export function GET(request: Request) {
  const counterId = ANALYTICS_CONFIG.yandexMetrikaId;
  // Демо-бот считает «Старт» по источнику (план «UTM-метки», Ф4): скан
  // демо-QR с лендинга и просто открытая страница — разные дороги.
  const startSource = demoStartSourceFromUrl(request.url);

  return htmlResponse(
    renderChooserPage({
      title: DEMO_TITLE,
      targets: {
        [CHOOSER_MESSENGER.MAX]: buildDemoBotLink(LINKS.demo.max, startSource),
        [CHOOSER_MESSENGER.TELEGRAM]: buildDemoBotLink(
          LINKS.demo.telegram,
          startSource,
        ),
      },
      poweredByUrl: demoPagePoweredByUrl(),
      logo: DEMO_LOGO_DATA_URI,
      metrika: counterId ? { counterId, goals: DEMO_GOALS } : undefined,
    }),
  );
}
