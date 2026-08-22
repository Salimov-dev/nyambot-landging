import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BRAND_CONFIG } from "@/config/brand.config";
import { LINKS } from "@/config/links.config";
import { createPageMetadata } from "@/config/seo.config";
import { LEGAL_DOCUMENT, loadLegalDocument } from "@/lib/legal-document";

export const metadata = createPageMetadata({
  title: `Политика cookie | ${BRAND_CONFIG.name}`,
  description:
    "Политика использования cookie на сайте Нямбота: какие файлы cookie мы применяем, зачем они нужны и как управлять их настройками.",
  path: LINKS.legal.cookies,
});

/**
 * Документ живёт ОДИН — в источнике на главном сервере (см. lib/legal-document).
 * Час, как и у fetch: Next разбирает это значение статически и принимает
 * только литерал — импортированная константа роняет прод-сборку.
 */
export const revalidate = 3600;

export default async function CookiesPage() {
  const content = await loadLegalDocument(LEGAL_DOCUMENT.COOKIES);

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
