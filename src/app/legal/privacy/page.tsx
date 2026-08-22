import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BRAND_CONFIG } from "@/config/brand.config";
import { LINKS } from "@/config/links.config";
import { createPageMetadata } from "@/config/seo.config";
import { LEGAL_DOCUMENT, loadLegalDocument } from "@/lib/legal-document";

export const metadata = createPageMetadata({
  title: `Политика конфиденциальности | ${BRAND_CONFIG.name}`,
  description:
    "Политика конфиденциальности Нямбота: какие персональные данные мы собираем, как обрабатываем и храним, ваши права и порядок защиты данных.",
  path: LINKS.legal.privacy,
});

/**
 * Документ живёт ОДИН — в источнике на главном сервере (см. lib/legal-document).
 * Час, как и у fetch: Next разбирает это значение статически и принимает
 * только литерал — импортированная константа роняет прод-сборку.
 */
export const revalidate = 3600;

export default async function PrivacyPage() {
  const content = await loadLegalDocument(LEGAL_DOCUMENT.PRIVACY);

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
