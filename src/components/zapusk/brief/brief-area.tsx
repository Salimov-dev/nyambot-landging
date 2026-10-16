"use client";

import { useRef, useState } from "react";
import { BRIEF_FORM_TEXT, ZAPUSK_AFTER } from "@/config/zapusk-page.config";
import { BriefForm } from "./brief-form";
import { StepsCard } from "./steps-card";
import styles from "./brief.module.css";

/**
 * Заявка на странице `/zapusk`: форма в одну колонку, под ней — «Что будет
 * после заявки» (Руслан 09.10). После отправки — «Заявка у нас» и те же шаги
 * с отмеченным первым. «Как мы работаем» стоит над формой — на странице.
 */
export function BriefArea() {
  const [sent, setSent] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  const handleSuccess = () => {
    setSent(true);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={top} className={styles.area}>
      {sent ? (
        <div className={styles.success} role="status" aria-live="polite">
          <p className={styles.successTitle}>{BRIEF_FORM_TEXT.successTitle}</p>
          <p className={styles.successText}>{BRIEF_FORM_TEXT.successText}</p>
        </div>
      ) : (
        <BriefForm onSuccess={handleSuccess} />
      )}
      <StepsCard content={ZAPUSK_AFTER} firstDone={sent} />
    </div>
  );
}
