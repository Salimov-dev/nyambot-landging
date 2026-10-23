import { typograph } from "@/lib/typography/typograph";
import { splitTermLinks } from "@/lib/typography/term-links";
import styles from "./landing-page.module.css";

/**
 * Текст посадочной с типографикой, где название внешнего сервиса (ЮKassa) —
 * ссылка на его сайт. Новых слов не добавляет: ссылкой становится то, что уже
 * написано.
 */
export function LinkedText({ text }: { text: string }) {
  return (
    <>
      {splitTermLinks(typograph(text)).map((part, index) =>
        part.href ? (
          <a
            key={index}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.inlineLink}
          >
            {part.text}
          </a>
        ) : (
          part.text
        ),
      )}
    </>
  );
}
