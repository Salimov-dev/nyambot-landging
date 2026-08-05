import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

/**
 * Ворота сборки (Ф3b плана порядка работ, пункт «env-gate»).
 *
 * 🔴 Счётчик Метрики запекается в бандл на сборке. Не доехал — лендинг
 * выкатывается без счётчика и молча: страницы открываются, реклама крутится, а
 * визиты не считаются. Именно эти цифры сводятся с расходом Директа, поэтому
 * пропажа счётчика делает выводы по рекламе ложными, а не просто неполными.
 *
 * Только для прод-сборки: `next dev` поднимается и без счётчика.
 */
const REQUIRED_BUILD_ENV = ["NEXT_PUBLIC_YANDEX_METRIKA_ID"] as const;

const assertBuildEnv = (): void => {
  const missing = REQUIRED_BUILD_ENV.filter(
    (name) => !process.env[name]?.trim(),
  );

  if (missing.length === 0) return;

  throw new Error(
    `Сборка остановлена — не заданы переменные, которые запекаются в бандл: ${missing.join(", ")}. ` +
      "Локально их место в .env.local проекта, на проде — build-arg в docker/docker-compose.prod.yml",
  );
};

const nextConfig: NextConfig = {
  output: "standalone",
};

/** Next вызывает конфиг с фазой — по ней и отличается сборка от dev-сервера. */
const resolveConfig = (phase: string): NextConfig => {
  if (phase === PHASE_PRODUCTION_BUILD) {
    assertBuildEnv();
  }

  return nextConfig;
};

export default resolveConfig;
