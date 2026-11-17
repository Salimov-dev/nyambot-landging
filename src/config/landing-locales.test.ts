import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const LOCALES = resolve(import.meta.dirname, "../../public/locales");
const LANGUAGES = ["en", "az", "be", "ky", "tg", "uz"] as const;

function collectText(value: unknown, prefix = ""): Map<string, string> {
  if (typeof value === "string") return new Map([[prefix, value]]);
  if (value === null || typeof value !== "object") return new Map();
  return new Map(
    Object.entries(value).flatMap(([key, child]) => [
      ...collectText(child, prefix ? `${prefix}.${key}` : key),
    ]),
  );
}

const read = (language: string): Map<string, string> => {
  const parsed: unknown = JSON.parse(
    readFileSync(resolve(LOCALES, language, "landing.json"), "utf8"),
  );
  return collectText(parsed);
};

const placeholders = (value: string): string[] =>
  [...value.matchAll(/\{\{\s*([^}]+)\s*\}\}/gu)]
    .map((match) => match[1].trim())
    .sort();

describe("all landing languages cover the same tasks and interpolation parameters", () => {
  const reference = read("ru");

  it.each(LANGUAGES)(
    "%s: modules, hall, FAQ and every other text are translated",
    (language) => {
      const translated = read(language);
      expect([...translated.keys()].sort()).toEqual(
        [...reference.keys()].sort(),
      );
      for (const [key, value] of reference) {
        const text = translated.get(key);
        expect(text?.trim(), `${language}:${key}`).toBeTruthy();
        expect(placeholders(text ?? ""), `${language}:${key}`).toEqual(
          placeholders(value),
        );
      }
    },
  );
});
