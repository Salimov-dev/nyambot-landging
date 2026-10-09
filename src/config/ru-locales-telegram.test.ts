import { readdirSync, readFileSync } from "fs";
import { join, resolve } from "path";
import { describe, expect, it } from "vitest";

/**
 * Сторож формы «Телеграм» (план «Лояльность владельца», Ф9, 08.10.2026): в
 * текстах лендинга слово не склоняется — «в MAX или Телеграм», не «Телеграме»
 * (правило — `seo.config.ts`). Смотрим только ru-локали: комментарии кода
 * могут склонять слово, гость их не видит.
 */
const RU_LOCALES_DIR = resolve(import.meta.dirname, "../../public/locales/ru");
const DECLINED_TELEGRAM = /Телеграм[аеуо]/u;

const listJsonFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listJsonFiles(path);
    return entry.name.endsWith(".json") ? [path] : [];
  });

describe("ru-локали лендинга", () => {
  const files = listJsonFiles(RU_LOCALES_DIR);

  it("локали найдены", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)("%s — «Телеграм» без падежных окончаний", (file) => {
    const declinedLines = readFileSync(file, "utf8")
      .split("\n")
      .map((line, index) => ({ line: line.trim(), number: index + 1 }))
      .filter(({ line }) => DECLINED_TELEGRAM.test(line));
    expect(declinedLines).toEqual([]);
  });
});
