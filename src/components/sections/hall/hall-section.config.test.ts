import { existsSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";
import { HALL_POINTS, HALL_VIDEO, HallPoint } from "./hall-section.config";

const PUBLIC_DIR = resolve(import.meta.dirname, "../../../../public");

/** Ролик «Работа с залом»: шаги подсвечивают пункты блока по секунде ролика */
describe("HALL_VIDEO", () => {
  it("шаги идут по возрастанию секунд с нуля — иначе подсветка перескакивает", () => {
    const from = HALL_VIDEO.steps.map((s) => s.from);
    expect(from[0]).toBe(0);
    expect(from).toEqual([...from].sort((a, b) => a - b));
    expect(new Set(from).size).toBe(from.length);
  });

  it("петля начинается и кончается столом с QR — стык без скачка подсветки", () => {
    expect(HALL_VIDEO.steps[0].group).toBe(HallPoint.table);
    expect(HALL_VIDEO.steps.at(-1)?.group).toBe(HallPoint.table);
  });

  it("каждый шаг — пункт блока, подпись — заголовок этого пункта", () => {
    for (const step of HALL_VIDEO.steps) {
      expect(step.group).not.toBeNull();
      expect(HALL_POINTS).toContain(step.group);
      expect(step.key).toBe(`hallBlock.points.${step.group}.title`);
    }
  });

  it("ролик и постер лежат в public", () => {
    expect(existsSync(resolve(PUBLIC_DIR, `.${HALL_VIDEO.src}`))).toBe(true);
    expect(existsSync(resolve(PUBLIC_DIR, `.${HALL_VIDEO.poster}`))).toBe(true);
  });
});
