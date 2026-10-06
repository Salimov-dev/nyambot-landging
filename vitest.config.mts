import { defineConfig } from "vitest/config";
import { resolve } from "path";

/**
 * Тесты лендинга — чистая логика и маршруты без браузера (план «Страница /go:
 * сайт и приложение», 03.10.2026): рендер страницы выбора и переадресация.
 * Псевдоним `@/` — тот же, что в `tsconfig.json`.
 */
export default defineConfig({
  resolve: {
    alias: { "@": resolve(import.meta.dirname, "src") },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
