import { htmlResponse } from "@/lib/messenger-chooser/chooser-response";
import {
  renderChooserMessagePage,
  renderChooserPage,
} from "@/lib/messenger-chooser/messenger-chooser.page";
import { CHOOSER_TEXT } from "@/lib/messenger-chooser/messenger-chooser.text";
import {
  CHOOSER_MESSENGERS,
  type IChooserTargets,
} from "@/lib/messenger-chooser/messenger-chooser.types";
import {
  fetchQrLink,
  isQrLinkSlug,
  QR_LINK_RESULT,
  QR_LINK_TRACK,
} from "@/lib/messenger-chooser/qr-link.api";

/**
 * `nyambot.ru/go/<slug>` — куда ведёт общий QR-код заведения: гость выбирает
 * MAX или Телеграм.
 *
 * Кнопки ведут не прямо в мессенджер, а на `/go/<slug>/<мессенджер>`: там
 * засчитывается выбор и берётся свежая ссылка на бота. Метрики Нямбота здесь
 * нет — это гость заведения, а не наш посетитель.
 */

type IRouteContext = { params: Promise<{ slug: string }> };

const notFound = () =>
  htmlResponse(
    renderChooserMessagePage(
      CHOOSER_TEXT.notFoundTitle,
      CHOOSER_TEXT.notFoundText,
    ),
    404,
  );

export async function GET(_request: Request, context: IRouteContext) {
  const { slug } = await context.params;
  if (!isQrLinkSlug(slug)) return notFound();

  const result = await fetchQrLink(slug, QR_LINK_TRACK.OPEN);

  if (result.kind === QR_LINK_RESULT.NOT_FOUND) return notFound();
  if (result.kind === QR_LINK_RESULT.UNAVAILABLE) {
    return htmlResponse(
      renderChooserMessagePage(
        CHOOSER_TEXT.unavailableTitle,
        CHOOSER_TEXT.unavailableText,
      ),
      503,
    );
  }

  const { data } = result;
  const targets = Object.fromEntries(
    CHOOSER_MESSENGERS.map((messenger) => [
      messenger,
      data.targets[messenger] ? `/go/${slug}/${messenger}` : null,
    ]),
  ) as IChooserTargets;

  // Ни одного живого бота — для гостя это та же «ссылка не работает».
  if (CHOOSER_MESSENGERS.every((messenger) => !targets[messenger])) {
    return notFound();
  }

  return htmlResponse(
    renderChooserPage({
      title: data.title,
      targets,
      poweredBy: true,
      logo: data.logo,
      colorScheme: data.colorScheme,
    }),
  );
}
