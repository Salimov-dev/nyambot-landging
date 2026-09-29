import {
  htmlResponse,
  redirectResponse,
} from "@/lib/messenger-chooser/chooser-response";
import { renderChooserMessagePage } from "@/lib/messenger-chooser/messenger-chooser.page";
import { CHOOSER_TEXT } from "@/lib/messenger-chooser/messenger-chooser.text";
import { isChooserMessenger } from "@/lib/messenger-chooser/messenger-chooser.types";
import { clickQrLink, isQrLinkSlug } from "@/lib/messenger-chooser/qr-link.api";

/**
 * `nyambot.ru/go/<slug>/<max|telegram>` — гость нажал кнопку: засчитать выбор
 * и увести в мессенджер. Ссылка на бота — свежая с main-server, а если он не
 * ответил — последняя известная: гостя в мессенджер ведём при любом исходе.
 */

type IRouteContext = {
  params: Promise<{ slug: string; messenger: string }>;
};

export async function GET(_request: Request, context: IRouteContext) {
  const { slug, messenger } = await context.params;

  const target =
    isQrLinkSlug(slug) && isChooserMessenger(messenger)
      ? await clickQrLink(slug, messenger)
      : null;

  if (!target) {
    return htmlResponse(
      renderChooserMessagePage(
        CHOOSER_TEXT.notFoundTitle,
        CHOOSER_TEXT.notFoundText,
      ),
      404,
    );
  }

  return redirectResponse(target);
}
