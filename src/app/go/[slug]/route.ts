import { htmlResponse } from "@/lib/messenger-chooser/chooser-response";
import { qrPagePoweredByUrl } from "@/lib/messenger-chooser/chooser-tracking";
import {
  renderChooserMessagePage,
  renderChooserPage,
} from "@/lib/messenger-chooser/messenger-chooser.page";
import { CHOOSER_TEXT } from "@/lib/messenger-chooser/messenger-chooser.text";
import {
  CHOOSER_EXTRAS,
  CHOOSER_MESSENGERS,
  type IChooserExtras,
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
 * MAX или Телеграм, а ниже — сайт и приложение заведения, если они указаны.
 *
 * Кнопки ведут не прямо по ссылке, а на `/go/<slug>/<куда>`: там
 * засчитывается переход и берётся свежая ссылка. Метрики Нямбота здесь
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

  const extras = Object.fromEntries(
    CHOOSER_EXTRAS.map((extra) => [
      extra,
      data.extras[extra] ? `/go/${slug}/${extra}` : null,
    ]),
  ) as IChooserExtras;

  // Ни одного живого бота — для гостя это та же «ссылка не работает»: код
  // ведёт к боту, сайт и приложение без него страницу не держат.
  if (CHOOSER_MESSENGERS.every((messenger) => !targets[messenger])) {
    return notFound();
  }

  return htmlResponse(
    renderChooserPage({
      title: data.title,
      targets,
      extras,
      poweredByUrl: qrPagePoweredByUrl(slug),
      logo: data.logo,
      colorScheme: data.colorScheme,
    }),
  );
}
