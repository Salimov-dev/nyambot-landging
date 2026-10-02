import {
  htmlResponse,
  redirectResponse,
} from "@/lib/messenger-chooser/chooser-response";
import { renderChooserMessagePage } from "@/lib/messenger-chooser/messenger-chooser.page";
import { CHOOSER_TEXT } from "@/lib/messenger-chooser/messenger-chooser.text";
import { isChooserTarget } from "@/lib/messenger-chooser/messenger-chooser.types";
import { clickQrLink, isQrLinkSlug } from "@/lib/messenger-chooser/qr-link.api";

/**
 * `nyambot.ru/go/<slug>/<max|telegram|site|app-ios|app-android|app-rustore>` —
 * гость нажал кнопку: засчитать переход и увести в мессенджер, на сайт или в
 * магазин приложений. Ссылка — свежая с main-server (он же перепроверяет
 * ссылку ресурса), а если сервер не ответил — последняя известная: гостя
 * ведём при любом исходе счётчика.
 */

type IRouteContext = {
  params: Promise<{ slug: string; target: string }>;
};

export async function GET(_request: Request, context: IRouteContext) {
  const { slug, target } = await context.params;

  const url =
    isQrLinkSlug(slug) && isChooserTarget(target)
      ? await clickQrLink(slug, target)
      : null;

  if (!url) {
    return htmlResponse(
      renderChooserMessagePage(
        CHOOSER_TEXT.notFoundTitle,
        CHOOSER_TEXT.notFoundText,
      ),
      404,
    );
  }

  return redirectResponse(url);
}
