import {
  BOOKING_LINK_RESULT,
  fetchBookingLink,
  isBookingCode,
} from "@/lib/messenger-chooser/booking-link.api";
import { htmlResponse } from "@/lib/messenger-chooser/chooser-response";
import { tablePagePoweredByUrl } from "@/lib/messenger-chooser/chooser-tracking";
import {
  renderChooserMessagePage,
  renderChooserPage,
} from "@/lib/messenger-chooser/messenger-chooser.page";
import { CHOOSER_TEXT } from "@/lib/messenger-chooser/messenger-chooser.text";
import { CHOOSER_MESSENGERS } from "@/lib/messenger-chooser/messenger-chooser.types";

/**
 * `nyambot.ru/b/<код>` — ссылка на бронь точки из СРМ (Ф10в «Бронь — вход»):
 * для кнопки «Забронировать» на сайте, в Яндекс Картах и 2ГИС, в соцсетях и
 * QR на флаере. Гость выбирает MAX или Телеграм и попадает в бот заведения с
 * `/start book_<код>` — бот открывает бронь этой точки. Один мессенджер —
 * сразу туда.
 *
 * Кнопки — прямые ссылки на ботов, как у QR стола: код в наши адреса и метки
 * не уходит. Метрики Нямбота здесь нет — это гость заведения. Кода нет —
 * «ссылка не найдена»; бронь у точки не работает — так и говорим, без чужой
 * брони и без меню.
 */

type IRouteContext = { params: Promise<{ code: string }> };

const HTTP_STATUS = {
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNAVAILABLE: 503,
} as const;

const notFound = () =>
  htmlResponse(
    renderChooserMessagePage(
      CHOOSER_TEXT.bookingNotFoundTitle,
      CHOOSER_TEXT.bookingNotFoundText,
    ),
    HTTP_STATUS.NOT_FOUND,
  );

export async function GET(_request: Request, context: IRouteContext) {
  const { code } = await context.params;
  if (!isBookingCode(code)) return notFound();

  const result = await fetchBookingLink(code);
  switch (result.kind) {
    case BOOKING_LINK_RESULT.NOT_FOUND:
      return notFound();
    case BOOKING_LINK_RESULT.BOOKING_OFF:
      return htmlResponse(
        renderChooserMessagePage(
          CHOOSER_TEXT.bookingOffTitle,
          CHOOSER_TEXT.bookingOffText,
        ),
        HTTP_STATUS.CONFLICT,
      );
    case BOOKING_LINK_RESULT.UNAVAILABLE:
      return htmlResponse(
        renderChooserMessagePage(
          CHOOSER_TEXT.unavailableTitle,
          CHOOSER_TEXT.unavailableText,
        ),
        HTTP_STATUS.UNAVAILABLE,
      );
    case BOOKING_LINK_RESULT.OK: {
      const { data } = result;
      if (CHOOSER_MESSENGERS.every((messenger) => !data.targets[messenger])) {
        return notFound();
      }
      return htmlResponse(
        renderChooserPage({
          title: data.title,
          booking: true,
          address: data.address || null,
          targets: data.targets,
          poweredByUrl: tablePagePoweredByUrl(),
          logo: data.logo,
          colorScheme: data.colorScheme,
        }),
      );
    }
    default: {
      const unreachable: never = result;
      return unreachable;
    }
  }
}
