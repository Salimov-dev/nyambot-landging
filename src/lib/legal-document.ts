/**
 * Юридические документы лендинга берутся ИЗ ИСТОЧНИКА — с главного сервера,
 * `public/legal-documents`. Своей копии у лендинга нет.
 *
 * 🔴 Почему так. До 05.08.2026 документы лежали в двух местах независимо:
 * юр-ревизия и переход на ООО правили лендинг, а клиенты в СРМ и витрине
 * открывали мартовскую редакцию с реквизитами ИП — четыре документа
 * несуществующего лица. Любая схема с двумя файлами рано или поздно
 * расходится молча, потому что обе копии выглядят настоящими. Файл теперь
 * один физически.
 */
export const LEGAL_DOCUMENT = {
  OFFER: "nyambot-crm-public-offer.md",
  TERMS: "nyambot-crm-user-license-agreement.md",
  PRIVACY: "nyambot-personal-data-processing-policy.md",
  COOKIES: "nyambot-cookie-policy.md",
} as const;

export type LegalDocumentName =
  (typeof LEGAL_DOCUMENT)[keyof typeof LEGAL_DOCUMENT];

/**
 * Путь публичной отдачи документов главным сервером (ключ API не нужен).
 *
 * 🔴 Именно роут `/api/files/`, а НЕ статика `/legal-documents/`, хотя оба
 * адреса ведут к одному документу. Статику отдаёт Nitro по манифесту,
 * снятому на сборке: длина ответа берётся оттуда, поэтому подменённый файл
 * обрезается по старому размеру — юридический документ обрывается на
 * середине фразы, отвечая при этом 200. Роут читает файл с диска целиком,
 * и новый документ по нему доступен без пересборки главного сервера.
 */
const LEGAL_DOCUMENTS_PATH = "/api/files/legal-documents";

/**
 * Страницы кешируются на час: документ меняется раз в месяцы, а лишний поход к
 * серверу на каждый просмотр не нужен. При недоступности сервера Next
 * продолжает отдавать последнюю удачную версию страницы, поэтому сайт не
 * остаётся без юридических документов из-за короткого сбоя.
 */
export const LEGAL_PAGE_REVALIDATE_SECONDS = 3600;

export async function loadLegalDocument(
  name: LegalDocumentName,
): Promise<string> {
  const apiUrl = process.env.MAIN_SERVER_API_URL;

  if (!apiUrl) {
    throw new Error(
      "MAIN_SERVER_API_URL не задан — юридические документы брать неоткуда",
    );
  }

  const response = await fetch(`${apiUrl}${LEGAL_DOCUMENTS_PATH}/${name}`, {
    next: { revalidate: LEGAL_PAGE_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(
      `Юридический документ ${name} не получен с главного сервера: HTTP ${response.status}`,
    );
  }

  return response.text();
}
