import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BRAND_CONFIG } from "@/config/brand.config";

export const metadata: Metadata = {
  title: { absolute: `Политика конфиденциальности | ${BRAND_CONFIG.name}` },
  description:
    "Политика конфиденциальности Нямбота: какие персональные данные мы собираем, как обрабатываем и храним, ваши права и порядок защиты данных.",
};

export default function PrivacyPage() {
  const content = readFileSync(
    join(process.cwd(), "src/content/legal/privacy.md"),
    "utf-8",
  );

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
