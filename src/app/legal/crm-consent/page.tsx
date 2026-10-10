import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BRAND_CONFIG } from "@/config/brand.config";
import { LINKS } from "@/config/links.config";
import { createPageMetadata } from "@/config/seo.config";
import { LEGAL_DOCUMENT, loadLegalDocument } from "@/lib/legal-document";

export const metadata = createPageMetadata({
  title: `Согласие на обработку персональных данных пользователя СРМ | ${BRAND_CONFIG.name}`,
  description:
    "Согласие на обработку персональных данных при регистрации в СРМ Нямбота: цель, состав данных, срок хранения и как отозвать согласие.",
  path: LINKS.legal.crmConsent,
});

/**
 * Документ живёт ОДИН — в источнике на главном сервере (см. lib/legal-document).
 * Час, как и у fetch: Next разбирает это значение статически и принимает
 * только литерал — импортированная константа роняет прод-сборку.
 */
export const revalidate = 3600;

export default async function CrmConsentPage() {
  const content = await loadLegalDocument(LEGAL_DOCUMENT.CRM_USER_CONSENT);

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
