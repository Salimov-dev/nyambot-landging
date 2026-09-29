const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Экранирует текст и значения атрибутов для HTML, собранного строкой.
 *  Название заведения вводит ресторатор в СРМ — доверять ему разметку нельзя. */
export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
