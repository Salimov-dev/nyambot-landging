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
  title: { absolute: `Политика конфиденциальности | ${BRAND_CONFIG.name}` },
  description:
    "Политика конфиденциальности Нямбота: какие персональные данные мы собираем, как обрабатываем и храним, ваши права и порядок защиты данных.",
};

/** Документ живёт ОДИН — в источнике на главном сервере (см. lib/legal-document). */
export const revalidate = LEGAL_PAGE_REVALIDATE_SECONDS;

export default async function PrivacyPage() {
  const content = await loadLegalDocument(LEGAL_DOCUMENT.PRIVACY);

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
