import { readFileSync } from "fs";
import { join, resolve } from "path";
import { describe, expect, it } from "vitest";

/**
 * Сторож обращения «на ты» в переводах лендинга (правило продукта: с
 * ресторатором — на «ты», как в ru; находка аудита 16.10.2026).
 *
 * Ловим только надёжные маркеры «вы» — отдельные местоимения и окончания,
 * у которых нет омонимов в словарях. Окончания, совпадающие с другими формами
 * (az «-ın» — и повелительное «вы», и родительный падеж; uz «-ing»; be «-ыце» —
 * и «запыце»), не проверяем: сторож с ложными срабатываниями хуже, чем без него.
 *
 * Исключения — чужая речь, где «вы» правильно и в ru: гость спрашивает
 * заведение («До скольки работаете?») и кассир говорит гостю
 * («Отсканируйте — получите бонус…»).
 */
const LOCALES_DIR = resolve(import.meta.dirname, "../../public/locales");

const QUOTED_SPEECH_KEYS = new Set([
  "benefits.items.guestChat.text",
  "guestsPath.items.staff.text",
]);

const FORMAL_MARKERS: Record<string, RegExp[]> = {
  az: [
    /(?<!\p{L})(?:siz|sizin|sizə|sizi|sizdə|sizdən)(?!\p{L})/iu,
    /\p{L}+(?:sınız|siniz|sunuz|sünüz)(?!\p{L})/iu,
  ],
  ky: [
    /(?<!\p{L})(?:сиз|сиздин|сизге|сизди|сизде|силер|силерге|силердин)(?!\p{L})/iu,
    /\p{L}+ң(?:ыз|из|уз|үз)(?:дүн|дун|дын|дин|га|ге|го|гө|ка|ке|ды|ди|ду|дү|да|де|до|дө|дан|ден|дон|дөн)?(?!\p{L})/iu,
  ],
  uz: [/(?<!\p{L})(?:siz|sizning|sizga|sizni|sizda|sizdan)(?!\p{L})/iu],
  tg: [/(?<!\p{L})шумо(?!\p{L})/iu, /\p{L}+ед(?!\p{L})/u],
  be: [/(?<!\p{L})(?:вы|вас|вам|вамі|ваш\p{L}*)(?!\p{L})/iu],
};

const walk = (
  node: unknown,
  prefix: string,
  out: [string, string][],
): [string, string][] => {
  if (typeof node === "string") out.push([prefix, node]);
  else if (node && typeof node === "object")
    for (const [key, value] of Object.entries(node))
      walk(value, prefix ? `${prefix}.${key}` : key, out);
  return out;
};

describe("переводы лендинга — на «ты»", () => {
  it.each(Object.keys(FORMAL_MARKERS))("%s — без «вы»", (lng) => {
    const locale: unknown = JSON.parse(
      readFileSync(join(LOCALES_DIR, lng, "landing.json"), "utf8"),
    );
    const hits = walk(locale, "", [])
      .filter(([key]) => !QUOTED_SPEECH_KEYS.has(key))
      .filter(([, text]) =>
        FORMAL_MARKERS[lng].some((marker) => marker.test(text)),
      )
      .map(([key, text]) => `${key}: ${text}`);
    expect(hits).toEqual([]);
  });

  it("маркеры ловят «вы»", () => {
    expect(FORMAL_MARKERS.tg.some((m) => m.test("Ба мо нависед"))).toBe(true);
    expect(FORMAL_MARKERS.ky.some((m) => m.test("базаңыз"))).toBe(true);
    expect(FORMAL_MARKERS.az.some((m) => m.test("sizin qərarınız"))).toBe(true);
  });
});
