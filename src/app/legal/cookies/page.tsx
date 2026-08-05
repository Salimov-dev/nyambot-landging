import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BRAND_CONFIG } from "@/config/brand.config";
import {
  LEGAL_DOCUMENT,
  LEGAL_PAGE_REVALIDATE_SECONDS,
  loadLegalDocument,
} from "@/lib/legal-document";

export const metadata: Metadata = {
  title: { absolute: `Политика cookie | ${BRAND_CONFIG.name}` },
  description:
    "Политика использования cookie на сайте Нямбота: какие файлы cookie мы применяем, зачем они нужны и как управлять их настройками.",
};

/** Документ живёт ОДИН — в источнике на главном сервере (см. lib/legal-document). */
export const revalidate = LEGAL_PAGE_REVALIDATE_SECONDS;

export default async function CookiesPage() {
  const content = await loadLegalDocument(LEGAL_DOCUMENT.COOKIES);

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
