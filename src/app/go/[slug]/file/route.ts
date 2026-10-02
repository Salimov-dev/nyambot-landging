import {
  attachmentResponse,
  htmlResponse,
} from "@/lib/messenger-chooser/chooser-response";
import {
  renderChooserMessagePage,
  renderChooserPage,
} from "@/lib/messenger-chooser/messenger-chooser.page";
import { CHOOSER_TEXT } from "@/lib/messenger-chooser/messenger-chooser.text";
import {
  fetchQrLink,
  isQrLinkSlug,
  QR_LINK_RESULT,
  QR_LINK_TRACK,
} from "@/lib/messenger-chooser/qr-link.api";

/**
 * `nyambot.ru/go/<slug>/file` — та же страница выбора ФАЙЛОМ, для своего
 * домена клиента («Скачать страницу» в СРМ).
 *
 * 🔴 В файле кнопки ведут ПРЯМО в мессенджеры, на сайт и в магазины
 * приложений, без нашего счётчика и без
 * строки «Работает на Нямботе»: смысл файла — страница клиента, которая
 * работает без нас. Цена — ни переходов в СРМ, ни смены бота без повторной
 * загрузки файла; об этом предупреждает СРМ.
 */

type IRouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: IRouteContext) {
  const { slug } = await context.params;
  const result = isQrLinkSlug(slug)
    ? await fetchQrLink(slug, QR_LINK_TRACK.NONE)
    : null;

  if (!result || result.kind !== QR_LINK_RESULT.OK) {
    return htmlResponse(
      renderChooserMessagePage(
        CHOOSER_TEXT.notFoundTitle,
        CHOOSER_TEXT.notFoundText,
      ),
      404,
    );
  }

  return attachmentResponse(
    renderChooserPage({
      title: result.data.title,
      targets: result.data.targets,
      extras: result.data.extras,
      poweredByUrl: null,
      fileMarker: slug,
      // Лого вклеено data-URI — файл на домене клиента от нас не зависит.
      logo: result.data.logo,
      colorScheme: result.data.colorScheme,
    }),
    `${slug}.html`,
  );
}
