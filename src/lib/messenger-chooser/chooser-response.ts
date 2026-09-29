/** Страница выбора — всегда свежая: ссылки на ботов меняются в СРМ, а
 *  закэшированная где-то по пути страница вела бы на старого бота. */
const NO_STORE = "no-store";

export const htmlResponse = (html: string, status = 200): Response =>
  new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": NO_STORE,
      "X-Robots-Tag": "noindex, nofollow",
    },
  });

export const redirectResponse = (location: string): Response =>
  new Response(null, {
    status: 302,
    headers: { Location: location, "Cache-Control": NO_STORE },
  });

/** HTML файлом — «Скачать страницу» в СРМ. */
export const attachmentResponse = (html: string, fileName: string): Response =>
  new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": NO_STORE,
    },
  });
