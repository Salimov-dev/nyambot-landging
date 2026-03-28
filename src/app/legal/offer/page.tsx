import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BRAND_CONFIG } from "@/config/brand.config";

export const metadata: Metadata = {
  title: `Публичная оферта | ${BRAND_CONFIG.name}`,
};

export default function OfferPage() {
  const content = readFileSync(
    join(process.cwd(), "src/content/legal/offer.md"),
    "utf-8"
  );

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
