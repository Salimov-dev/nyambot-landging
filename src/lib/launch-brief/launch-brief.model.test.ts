import { describe, expect, it } from "vitest";
import {
  BRIEF_FIELD,
  BRIEF_LIMIT,
  BRIEF_ONLINE_PAYMENT,
  BRIEF_POS,
  createEmptyBriefState,
  enumValueOf,
  inputMaxLengthOf,
  isBriefEmpty,
  sanitizeBriefFormState,
} from "./launch-brief.model";

/**
 * Модель заявки на запуск: короткая форма (решение 10.10), значения
 * вариантов — ровно enum main-server
 * (`main-server-nyambot/config/leads/launch-brief.config.ts`).
 */
describe("варианты — значения enum main-server", () => {
  it("касса — те же пять значений, что у main-server", () => {
    expect(Object.values(BRIEF_POS).sort()).toEqual(
      ["IIKO", "NONE", "OTHER", "RKEEPER", "UNKNOWN"].sort(),
    );
  });

  it("платёжная система — те же четыре значения, что у main-server", () => {
    expect(Object.values(BRIEF_ONLINE_PAYMENT).sort()).toEqual(
      ["NONE", "OTHER_BANK", "YANDEX_PAY", "YOOKASSA"].sort(),
    );
  });

  it("чужое значение не проходит, своё — проходит", () => {
    expect(enumValueOf(BRIEF_POS, "IIKO")).toBe(BRIEF_POS.IIKO);
    expect(enumValueOf(BRIEF_POS, "iiko")).toBeNull();
    expect(enumValueOf(BRIEF_POS, undefined)).toBeNull();
  });
});

describe("поля короткой формы", () => {
  it("в форме ровно поля короткой формы — без города и ответов длинной", () => {
    const state = createEmptyBriefState();
    expect(Object.keys(state).sort()).toEqual(["choices", "texts"]);
    expect(Object.keys(state.texts).sort()).toEqual(
      [
        "name",
        "email",
        "phone",
        "max",
        "telegram",
        "venue",
        "site",
        "outletsTotal",
        "comment",
      ].sort(),
    );
    expect(Object.keys(state.choices).sort()).toEqual(
      ["onlinePayment", "pos"].sort(),
    );
  });

  it("предел ввода: у числа точек — четыре цифры, у прочих — как у main-server", () => {
    expect(inputMaxLengthOf(BRIEF_FIELD.OUTLETS_TOTAL)).toBe(
      BRIEF_LIMIT.OUTLETS_INPUT,
    );
    expect(inputMaxLengthOf(BRIEF_FIELD.SITE)).toBe(BRIEF_LIMIT.URL);
    expect(inputMaxLengthOf(BRIEF_FIELD.COMMENT)).toBe(BRIEF_LIMIT.LONG_TEXT);
    expect(inputMaxLengthOf(BRIEF_FIELD.NAME)).toBe(BRIEF_LIMIT.SHORT_TEXT);
  });
});

describe("sanitizeBriefFormState", () => {
  it("не похоже на форму — null", () => {
    for (const raw of [null, "x", [], { texts: {} }, { choices: {} }]) {
      expect(sanitizeBriefFormState(raw)).toBeNull();
    }
  });

  it("длиннее предела — обрезается", () => {
    const state = sanitizeBriefFormState({
      texts: { outletsTotal: "123456", venue: "В".repeat(500) },
      choices: {},
    });
    expect(state?.texts.outletsTotal).toBe("1234");
    expect(state?.texts.venue).toHaveLength(BRIEF_LIMIT.SHORT_TEXT);
  });
});

describe("isBriefEmpty", () => {
  it("пустая форма — пустая, любой ответ — уже нет", () => {
    const state = createEmptyBriefState();
    expect(isBriefEmpty(state)).toBe(true);
    state.texts.venue = "  ";
    expect(isBriefEmpty(state)).toBe(true);
    state.choices.onlinePayment = BRIEF_ONLINE_PAYMENT.NONE;
    expect(isBriefEmpty(state)).toBe(false);
  });
});
