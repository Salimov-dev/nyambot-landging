import { readdirSync, readFileSync } from "fs";
import { join, relative, resolve } from "path";
import { describe, expect, it } from "vitest";
import { LINKS } from "@/config/links.config";
import { ZAPUSK_PAGE } from "@/config/zapusk-page.config";

/**
 * Сторож закрытой саморегистрации (решение Руслана 17.10.2026): большинство
 * зарегистрировавшихся в СРМ сами так ничего и не настроили, а контакта с ними
 * не было — лид терялся. На сайте одна дорога — «Запустим за тебя бесплатно»
 * на `/zapusk`; ни кнопки «Настрою сам», ни ссылки на регистрацию в СРМ.
 *
 * Смотрим код без комментариев и словари всех языков. Юрдоки (`app/legal`)
 * правятся отдельно и сюда не входят.
 */
const SRC_DIR = resolve(import.meta.dirname, "..");
const LOCALES_DIR = resolve(SRC_DIR, "../public/locales");
const LEGAL_DIR = join(SRC_DIR, "app", "legal");

const REGISTER_MODE_PATTERN = /mode=register/u;

/** Адрес регистрации в СРМ, прежнее имя ссылки на него и цель Метрики. */
const REGISTER_LINK_PATTERNS: RegExp[] = [
  REGISTER_MODE_PATTERN,
  /crmRegister/u,
  /click_trial[^\n]*to:\s*"crm"/u,
];

/** «Настрою сам» и «Хочешь настроить сам?» на всех языках лендинга. */
const SELF_SETUP_TEXTS: string[] = [
  "Настрою сам",
  "Хочешь настроить сам",
  "Настраиваешь сам",
  "I'll set it up myself",
  "Setting it up yourself",
  "Özüm quraram",
  "Наладжу сам",
  "Өзүм жөндөйм",
  "Худам танзим мекунам",
  "Oʻzim sozlayman",
];

const listFiles = (dir: string, ext: RegExp): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory())
      return path === LEGAL_DIR ? [] : listFiles(path, ext);
    return ext.test(entry.name) && !/\.test\./u.test(entry.name) ? [path] : [];
  });

/** Код без комментариев: блочных, JSX и строчных (кроме `://` в адресах) */
const stripComments = (source: string): string =>
  source.replace(/\/\*[\s\S]*?\*\//gu, "").replace(/(^|[^:])\/\/.*$/gmu, "$1");

const collectStrings = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (value && typeof value === "object")
    return Object.values(value).flatMap(collectStrings);
  return [];
};

const hasSelfSetupText = (text: string): boolean =>
  SELF_SETUP_TEXTS.some((phrase) => text.includes(phrase));

describe("саморегистрации на лендинге нет", () => {
  it("🔴 в ссылках нет регистрации в СРМ", () => {
    expect(Object.keys(LINKS)).not.toContain("crmRegister");
    expect(JSON.stringify(LINKS)).not.toMatch(REGISTER_MODE_PATTERN);
  });

  it("🔴 код и страницы — без ссылок на регистрацию и «Настрою сам»", () => {
    const hits = listFiles(SRC_DIR, /\.tsx?$/u).flatMap((file) =>
      stripComments(readFileSync(file, "utf8"))
        .split("\n")
        .filter(
          (line) =>
            REGISTER_LINK_PATTERNS.some((pattern) => pattern.test(line)) ||
            hasSelfSetupText(line),
        )
        .map((line) => `${relative(SRC_DIR, file)}: ${line.trim()}`),
    );
    expect(hits).toEqual([]);
  });

  it("🔴 словари всех языков — без «Настрою сам»", () => {
    const hits = listFiles(LOCALES_DIR, /\.json$/u).flatMap((file) =>
      collectStrings(JSON.parse(readFileSync(file, "utf8")))
        .filter(hasSelfSetupText)
        .map((text) => `${relative(LOCALES_DIR, file)}: ${text}`),
    );
    expect(hits).toEqual([]);
  });

  it("/zapusk — без строки «Хочешь настроить сам?»", () => {
    expect(collectStrings(ZAPUSK_PAGE).filter(hasSelfSetupText)).toEqual([]);
    expect(Object.keys(ZAPUSK_PAGE)).not.toContain("selfServe");
  });

  it("сторож узнаёт то, что ловит", () => {
    expect(hasSelfSetupText("Настрою сам")).toBe(true);
    expect(hasSelfSetupText("Запустим за тебя бесплатно")).toBe(false);
    expect(
      REGISTER_MODE_PATTERN.test("https://crm.nyambot.ru/login?mode=register"),
    ).toBe(true);
  });
});
