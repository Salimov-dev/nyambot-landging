import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BRAND_CONFIG } from "@/config/brand.config";

export const metadata: Metadata = {
  title: { absolute: `Лицензионное соглашение | ${BRAND_CONFIG.name}` },
  description:
    "Лицензионное соглашение Нямбота: условия предоставления права использования сервиса, ограничения, ответственность и порядок работы.",
};

export default function TermsPage() {
  const content = readFileSync(
    join(process.cwd(), "src/content/legal/terms.md"),
    "utf-8",
  );

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
