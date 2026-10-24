import { htmlResponse } from "@/lib/messenger-chooser/chooser-response";
import { tablePagePoweredByUrl } from "@/lib/messenger-chooser/chooser-tracking";
import {
  renderChooserMessagePage,
  renderChooserPage,
} from "@/lib/messenger-chooser/messenger-chooser.page";
import { CHOOSER_TEXT } from "@/lib/messenger-chooser/messenger-chooser.text";
import { CHOOSER_MESSENGERS } from "@/lib/messenger-chooser/messenger-chooser.types";
import {
  fetchTableQr,
  isTableToken,
  TABLE_QR_RESULT,
} from "@/lib/messenger-chooser/table-qr.api";

/**
 * `nyambot.ru/t/<токен>` — куда ведёт QR на столе (план «Работа с залом», Ф8
 * п. 1, Р11): гость выбирает MAX или Телеграм и попадает в бот заведения с
 * `/start table_<токен>` — бот знает стол. Один мессенджер — сразу туда.
 *
 * Кнопки — прямые ссылки на ботов: счётчика переходов у QR стола нет, а токен
 * стола в наши адреса и метки не уходит. Метрики Нямбота здесь нет — это гость
 * заведения. Стол перевыпущен, удалён или модуль кончился — «стол
 * недоступен», а не чужое меню.
 */

type IRouteContext = { params: Promise<{ token: string }> };

const notFound = () =>
  htmlResponse(
    renderChooserMessagePage(
      CHOOSER_TEXT.tableNotFoundTitle,
      CHOOSER_TEXT.tableNotFoundText,
    ),
    404,
  );

export async function GET(_request: Request, context: IRouteContext) {
  const { token } = await context.params;
  if (!isTableToken(token)) return notFound();

  const result = await fetchTableQr(token);
  if (result.kind === TABLE_QR_RESULT.NOT_FOUND) return notFound();
  if (result.kind === TABLE_QR_RESULT.UNAVAILABLE) {
    return htmlResponse(
      renderChooserMessagePage(
        CHOOSER_TEXT.unavailableTitle,
        CHOOSER_TEXT.unavailableText,
      ),
      503,
    );
  }

  const { data } = result;
  if (CHOOSER_MESSENGERS.every((messenger) => !data.targets[messenger])) {
    return notFound();
  }

  return htmlResponse(
    renderChooserPage({
      title: data.title,
      tableLabel: data.tableLabel || null,
      targets: data.targets,
      poweredByUrl: tablePagePoweredByUrl(),
      logo: data.logo,
      colorScheme: data.colorScheme,
    }),
  );
}
