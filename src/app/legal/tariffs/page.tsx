import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BRAND_CONFIG } from "@/config/brand.config";
import { LEGAL_DOCUMENT, loadLegalDocument } from "@/lib/legal-document";

export const metadata: Metadata = {
  title: { absolute: `Тарифы и стандарты | ${BRAND_CONFIG.name}` },
  description:
    "Тарифы и стандарты Нямбота: стоимость лицензии, условия пробного периода, стандартные лимиты по торговым точкам и ботам, условия акций и объём поддержки.",
};

/**
 * Документ живёт ОДИН — в источнике на главном сервере (см. lib/legal-document).
 * Час, как и у fetch: Next разбирает это значение статически и принимает
 * только литерал — импортированная константа роняет прод-сборку.
 */
export const revalidate = 3600;

export default async function TariffsPage() {
  const content = await loadLegalDocument(LEGAL_DOCUMENT.TARIFFS);

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
