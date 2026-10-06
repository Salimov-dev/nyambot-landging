import type { CSSProperties } from "react";
import styles from "./hero-section.module.css";

/** Когда начинается печать — первый экран уже нарисован */
const TYPE_START_MS = 350;
/** Шаг между буквами */
const TYPE_STEP_MS = 55;

type IProps = { text: string };

/**
 * Акцентная фраза заголовка печатается по буквам, курсор идёт за ней и в конце
 * пару раз мигает (Руслан 06.10.2026: «лендинг открывается, а там просто
 * статика»).
 *
 * 🔴 Только CSS, без JS: печать стартует с первой отрисовкой, а не после
 * гидрации — на медленном телефоне скрипт оживает через секунды. Ненапечатанные
 * буквы невидимы, но занимают место: строки заголовка не прыгают. Без JS и для
 * поисковика текст целиком в разметке; «уменьшить движение» — сразу целиком.
 */
export function TypedAccent({ text }: IProps) {
  const chars = Array.from(text);

  return (
    <em className={styles.typed}>
      {chars.map((char, index) => (
        <span
          // Буквы фразы не переставляются — индекс устойчив
          key={index}
          className={`${styles.typedChar} ${index === chars.length - 1 ? styles.typedCharLast : ""}`}
          style={
            {
              "--type-delay": `${TYPE_START_MS + index * TYPE_STEP_MS}ms`,
              "--type-step": `${TYPE_STEP_MS}ms`,
            } as CSSProperties
          }
        >
          {char}
        </span>
      ))}
    </em>
  );
}

/** Заголовок из словаря: «…<em>акцент</em>…» → части до, акцент, после */
export const splitAccent = (
  html: string,
): { before: string; accent: string; after: string } | null => {
  const match = /^([\s\S]*?)<em>([\s\S]*?)<\/em>([\s\S]*)$/.exec(html);
  if (!match) return null;
  const [, before, accentHtml, after] = match;
  return {
    before,
    accent: accentHtml.replace(/&nbsp;/g, " "),
    after,
  };
};
