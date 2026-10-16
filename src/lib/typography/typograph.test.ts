import { describe, expect, it } from "vitest";
import { glueDash, typograph } from "./typograph";

const NBSP = " ";

describe("typograph", () => {
  it("пробел перед тире — неразрывный, после — обычный", () => {
    expect(glueDash("Запуск — бесплатно")).toBe(`Запуск${NBSP}— бесплатно`);
  });

  it("каждое тире в тексте", () => {
    expect(glueDash("Касса — своя, меню — из кассы")).toBe(
      `Касса${NBSP}— своя, меню${NBSP}— из кассы`,
    );
  });

  it("дефис и тире без пробелов не трогает", () => {
    expect(glueDash("R-Keeper, 2–5 точек")).toBe("R-Keeper, 2–5 точек");
  });

  it("склеивает и последнее слово", () => {
    expect(typograph("Запуск — это просто")).toBe(
      `Запуск${NBSP}— это${NBSP}просто`,
    );
  });
});
