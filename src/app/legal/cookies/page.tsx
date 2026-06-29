import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BRAND_CONFIG } from "@/config/brand.config";

export const metadata: Metadata = {
  title: { absolute: `Политика cookie | ${BRAND_CONFIG.name}` },
  description:
    "Политика использования cookie на сайте Нямбота: какие файлы cookie мы применяем, зачем они нужны и как управлять их настройками.",
};

export default function CookiesPage() {
  const content = readFileSync(
    join(process.cwd(), "src/content/legal/cookies.md"),
    "utf-8",
  );

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
