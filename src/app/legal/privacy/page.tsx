import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BRAND_CONFIG } from "@/config/brand.config";

export const metadata: Metadata = {
  title: `Политика конфиденциальности | ${BRAND_CONFIG.name}`,
};

export default function PrivacyPage() {
  const content = readFileSync(
    join(process.cwd(), "src/content/legal/privacy.md"),
    "utf-8"
  );

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
