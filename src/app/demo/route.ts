import { ANALYTICS_CONFIG } from "@/config/analytics.config";
import { LINKS } from "@/config/links.config";
import type { MetrikaGoal } from "@/config/metrika";
import { htmlResponse } from "@/lib/messenger-chooser/chooser-response";
import { renderChooserPage } from "@/lib/messenger-chooser/messenger-chooser.page";
import {
  CHOOSER_MESSENGER,
  type IChooserMessenger,
} from "@/lib/messenger-chooser/messenger-chooser.types";

/**
 * Общий QR-код демо-бота: `nyambot.ru/demo` — та же страница выбора, что
 * видит гость заведения по `nyambot.ru/go/<адрес>`. Ссылки берутся из
 * конфига, а не из базы: демо на лендинге не должно зависеть от записи в СРМ.
 *
 * В отличие от страницы заведения, здесь есть Метрика Нямбота: это наша
 * страница и наш посетитель.
 */

const DEMO_TITLE = "Демо Нямбота — кафе «Кусочек»";

const DEMO_GOALS: Record<IChooserMessenger, MetrikaGoal> = {
  [CHOOSER_MESSENGER.MAX]: "click_qr_demo_max",
  [CHOOSER_MESSENGER.TELEGRAM]: "click_qr_demo_tg",
};

export function GET() {
  const counterId = ANALYTICS_CONFIG.yandexMetrikaId;

  return htmlResponse(
    renderChooserPage({
      title: DEMO_TITLE,
      targets: {
        [CHOOSER_MESSENGER.MAX]: LINKS.demo.max,
        [CHOOSER_MESSENGER.TELEGRAM]: LINKS.demo.telegram,
      },
      poweredBy: true,
      metrika: counterId ? { counterId, goals: DEMO_GOALS } : undefined,
    }),
  );
}
