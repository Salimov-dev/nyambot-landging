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
  title: { absolute: `Лицензионное соглашение | ${BRAND_CONFIG.name}` },
  description:
    "Лицензионное соглашение Нямбота: условия предоставления права использования сервиса, ограничения, ответственность и порядок работы.",
};

/** Документ живёт ОДИН — в источнике на главном сервере (см. lib/legal-document). */
export const revalidate = LEGAL_PAGE_REVALIDATE_SECONDS;

export default async function TermsPage() {
  const content = await loadLegalDocument(LEGAL_DOCUMENT.TERMS);

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
