import { htmlResponse } from "@/lib/messenger-chooser/chooser-response";
import {
  DEMO_EXTRA_ACTION,
  demoExtraText,
} from "@/lib/messenger-chooser/demo-extras";
import { renderChooserMessagePage } from "@/lib/messenger-chooser/messenger-chooser.page";
import { CHOOSER_TEXT } from "@/lib/messenger-chooser/messenger-chooser.text";
import { isChooserExtra } from "@/lib/messenger-chooser/messenger-chooser.types";

/**
 * `nyambot.ru/demo/<ресурс>` — заглушка сайта и приложения демо-кафе
 * «Кусочек»: куда кнопка блока «Ещё у заведения» ведёт у настоящего
 * заведения (`demo-extras.ts`).
 */

type IRouteContext = { params: Promise<{ extra: string }> };

export async function GET(_request: Request, context: IRouteContext) {
  const { extra } = await context.params;
  if (!isChooserExtra(extra)) {
    return htmlResponse(
      renderChooserMessagePage(
        CHOOSER_TEXT.notFoundTitle,
        CHOOSER_TEXT.notFoundText,
      ),
      404,
    );
  }

  const { title, text } = demoExtraText(extra);
  return htmlResponse(renderChooserMessagePage(title, text, DEMO_EXTRA_ACTION));
}
