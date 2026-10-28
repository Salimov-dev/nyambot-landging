import { describe, expect, it } from "vitest";
import { yourTableLabel } from "./table-qr.api";

/**
 * Строка стола на странице QR стола `/t/<токен>` (план «Работа с залом», Ф10в
 * п. 1): «Твой стол № 12 · Зал». Стол — тем же правилом, что подпись стола на
 * сервере и в боте: номер, имя из цифр — как номер, своё имя — в кавычках.
 */
describe("«Твой стол № 12 · Зал»", () => {
  it.each([
    [{ number: 12, name: "12", hallName: "Зал" }, "Твой стол № 12 · Зал"],
    [{ number: 12, name: "", hallName: "Зал" }, "Твой стол № 12 · Зал"],
    [
      { number: null, name: "7", hallName: "Веранда" },
      "Твой стол № 7 · Веранда",
    ],
    [{ number: 3, name: "Диван", hallName: "Зал" }, "Твой стол «Диван» · Зал"],
    [{ number: 12, name: "12", hallName: "" }, "Твой стол № 12"],
  ])("%o — «%s»", (table, label) => {
    expect(yourTableLabel(table)).toBe(label);
  });
});
