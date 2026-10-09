import { describe, expect, it } from "vitest";
import {
  BRIEF_ERROR,
  BRIEF_FIELD,
  BRIEF_POS,
  createEmptyBriefState,
  type BriefErrorCode,
  type BriefTextInputField,
  type LaunchBriefFormState,
} from "./launch-brief.model";
import {
  BRIEF_MISSING,
  formatErrorOf,
  missingOf,
  parseOutletsInput,
  type BriefMissing,
} from "./launch-brief.validation";

/**
 * Проверка заявки на запуск в браузере (план `brif-zapuska-2026-10-09`, Ф2):
 * обязательны имя и контакт, название и касса; форматы и коды — как у
 * main-server.
 */

/** Заявка с заполненными обязательными полями и ничем больше. */
const requiredOnly = (): LaunchBriefFormState => {
  const state = createEmptyBriefState();
  state.texts.venue = "Ромашка";
  state.texts.name = "Анна";
  state.texts.telegram = "@romashka_cafe";
  state.choices.pos = BRIEF_POS.UNKNOWN;
  return state;
};

type TextCase = { field: BriefTextInputField; value: string };

describe("missingOf — обязательные поля", () => {
  it("пустая форма: первым не хватает имени", () => {
    expect(missingOf(createEmptyBriefState(), true)).toBe(BRIEF_MISSING.NAME);
  });

  it("порядок — как поля стоят в форме: имя, контакт, название, касса, согласие", () => {
    const state = createEmptyBriefState();
    const steps: Array<{ fill: () => void; next: BriefMissing }> = [
      {
        fill: () => {
          state.texts.name = "Анна";
        },
        next: BRIEF_MISSING.CONTACT,
      },
      {
        fill: () => {
          state.texts.phone = "+7 900 123-45-67";
        },
        next: BRIEF_MISSING.VENUE,
      },
      {
        fill: () => {
          state.texts.venue = "Ромашка";
        },
        next: BRIEF_MISSING.POS,
      },
      {
        fill: () => {
          state.choices.pos = BRIEF_POS.IIKO;
        },
        next: BRIEF_MISSING.CONSENT,
      },
    ];
    for (const step of steps) {
      step.fill();
      expect(missingOf(state, false)).toBe(step.next);
    }
    expect(missingOf(state, true)).toBeNull();
  });

  it("пробелы — не ответ", () => {
    const state = requiredOnly();
    state.texts.venue = "   ";
    expect(missingOf(state, true)).toBe(BRIEF_MISSING.VENUE);
    state.texts.venue = "Ромашка";
    state.texts.name = "  ";
    expect(missingOf(state, true)).toBe(BRIEF_MISSING.NAME);
  });

  it("контакт — любой из трёх: телефон, MAX или Телеграм", () => {
    const contacts: TextCase[] = [
      { field: BRIEF_FIELD.PHONE, value: "89001234567" },
      { field: BRIEF_FIELD.MAX, value: "89001234567" },
      { field: BRIEF_FIELD.TELEGRAM, value: "@romashka" },
    ];
    for (const { field, value } of contacts) {
      const state = requiredOnly();
      state.texts.telegram = "";
      state.texts[field] = value;
      expect(missingOf(state, true)).toBeNull();
    }
  });

  it("почта — не способ связи: без телефона и мессенджера заявку не отправить", () => {
    const state = requiredOnly();
    state.texts.telegram = "";
    state.texts.email = "anna@mail.ru";
    expect(missingOf(state, true)).toBe(BRIEF_MISSING.CONTACT);
  });

  it("«Не знаю» — тоже ответ про кассу", () => {
    expect(missingOf(requiredOnly(), true)).toBeNull();
  });

  it("сайт, почта, точки, платёжная система и комментарий — не обязательны", () => {
    const state = requiredOnly();
    expect(state.texts.site).toBe("");
    expect(state.texts.email).toBe("");
    expect(state.texts.outletsTotal).toBe("");
    expect(state.texts.comment).toBe("");
    expect(state.choices.onlinePayment).toBeNull();
    expect(missingOf(state, true)).toBeNull();
    expect(formatErrorOf(state)).toBeNull();
  });
});

describe("formatErrorOf — форматы заполненного", () => {
  it("только обязательные поля — ошибок нет", () => {
    expect(formatErrorOf(requiredOnly())).toBeNull();
  });

  const INVALID: Array<TextCase & { code: BriefErrorCode }> = [
    {
      field: BRIEF_FIELD.PHONE,
      value: "12345",
      code: BRIEF_ERROR.INVALID_PHONE,
    },
    {
      field: BRIEF_FIELD.PHONE,
      value: "позвоните",
      code: BRIEF_ERROR.INVALID_PHONE,
    },
    {
      field: BRIEF_FIELD.TELEGRAM,
      value: "@ab",
      code: BRIEF_ERROR.INVALID_TELEGRAM,
    },
    {
      field: BRIEF_FIELD.MAX,
      value: "romashka",
      code: BRIEF_ERROR.INVALID_MAX,
    },
    {
      field: BRIEF_FIELD.EMAIL,
      value: "anna@",
      code: BRIEF_ERROR.INVALID_EMAIL,
    },
    {
      field: BRIEF_FIELD.SITE,
      value: "мой сайт",
      code: BRIEF_ERROR.INVALID_SITE,
    },
    {
      field: BRIEF_FIELD.OUTLETS_TOTAL,
      value: "две",
      code: BRIEF_ERROR.INVALID_OUTLETS,
    },
    {
      field: BRIEF_FIELD.OUTLETS_TOTAL,
      value: "0",
      code: BRIEF_ERROR.INVALID_OUTLETS,
    },
    {
      field: BRIEF_FIELD.OUTLETS_TOTAL,
      value: "1001",
      code: BRIEF_ERROR.INVALID_OUTLETS,
    },
    {
      field: BRIEF_FIELD.NAME,
      value: "https://spam.example",
      code: BRIEF_ERROR.NAME_REQUIRED,
    },
  ];

  for (const { field, value, code } of INVALID) {
    it(`${field} = «${value}» → ${code}`, () => {
      const state = requiredOnly();
      state.texts[field] = value;
      expect(formatErrorOf(state)).toBe(code);
    });
  }

  const VALID: TextCase[] = [
    { field: BRIEF_FIELD.TELEGRAM, value: "t.me/romashka_cafe" },
    { field: BRIEF_FIELD.TELEGRAM, value: "+7 900 123-45-67" },
    { field: BRIEF_FIELD.MAX, value: "https://max.ru/romashka" },
    { field: BRIEF_FIELD.MAX, value: "8 (900) 123-45-67" },
    { field: BRIEF_FIELD.SITE, value: "mycafe.ru" },
    { field: BRIEF_FIELD.SITE, value: "https://vk.com/mycafe" },
    { field: BRIEF_FIELD.OUTLETS_TOTAL, value: "1000" },
    { field: BRIEF_FIELD.OUTLETS_TOTAL, value: "2–5" },
  ];

  for (const { field, value } of VALID) {
    it(`${field} = «${value}» — подходит`, () => {
      const state = requiredOnly();
      state.texts[field] = value;
      expect(formatErrorOf(state)).toBeNull();
    });
  }

  it("первая ошибка — в порядке main-server: телефон раньше сайта, сайт раньше точек", () => {
    const state = requiredOnly();
    state.texts.outletsTotal = "0";
    state.texts.site = "мой сайт";
    state.texts.phone = "1";
    expect(formatErrorOf(state)).toBe(BRIEF_ERROR.INVALID_PHONE);
    state.texts.phone = "";
    expect(formatErrorOf(state)).toBe(BRIEF_ERROR.INVALID_SITE);
  });
});

describe("parseOutletsInput", () => {
  it("пусто — «не ответил», целое — числом, прочее — ошибка", () => {
    expect(parseOutletsInput("")).toEqual({ valid: true, value: null });
    expect(parseOutletsInput(" 12 ")).toEqual({ valid: true, value: 12 });
    expect(parseOutletsInput("1,5")).toEqual({ valid: false, value: null });
  });

  it("диапазон — верхняя граница, вне 1–1000 — ошибка", () => {
    expect(parseOutletsInput("2-5")).toEqual({ valid: true, value: 5 });
    expect(parseOutletsInput("2 — 5")).toEqual({ valid: true, value: 5 });
    expect(parseOutletsInput("5-1001")).toEqual({ valid: false, value: null });
  });
});
