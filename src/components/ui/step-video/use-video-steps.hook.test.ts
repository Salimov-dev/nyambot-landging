import { describe, expect, it } from "vitest";
import { stepAt } from "./use-video-steps.hook";
import { VITRINA_VIDEO } from "@/components/sections/vitrina/vitrina-video.config";

/** Подсветка главы идёт по секунде ролика: шаг — последний, чья секунда уже наступила */
describe("stepAt", () => {
  const steps = [
    { from: 0, group: null, key: "a" },
    { from: 2.6, group: null, key: "b" },
    { from: 4.9, group: null, key: "c" },
  ] as const;

  it("до первой границы — первый шаг", () => {
    expect(stepAt(steps, 0)).toBe(0);
    expect(stepAt(steps, 2.59)).toBe(0);
  });

  it("на границе — уже следующий шаг", () => {
    expect(stepAt(steps, 2.6)).toBe(1);
    expect(stepAt(steps, 4.9)).toBe(2);
  });

  it("после последней границы — последний шаг", () => {
    expect(stepAt(steps, 47)).toBe(2);
  });

  it("главы «Витрины» идут по возрастанию секунд — иначе подсветка перескакивает", () => {
    const from = VITRINA_VIDEO.steps.map((s) => s.from);
    expect(from).toEqual([...from].sort((a, b) => a - b));
    expect(new Set(from).size).toBe(from.length);
  });
});
