import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    // Сборочные артефакты. Раньше их отсекал `next lint`, после перехода
    // на eslint CLI список задаётся явно.
    ignores: [".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"],
  },
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
