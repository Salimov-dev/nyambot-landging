"use client";

import { useRef, useState } from "react";
import { BRIEF_FORM_TEXT } from "@/config/zapusk-page.config";
import { AfterSteps } from "./after-steps";
import { BriefForm } from "./brief-form";
import styles from "./brief.module.css";

/**
 * Заявка на странице `/zapusk`: форма в одну колонку, под ней — «Что будет
 * после заявки» (Руслан 09.10). После отправки — «Заявка у нас» и те же шаги
 * с отмеченным первым.
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
      <AfterSteps sent={sent} />
    </div>
  );
}
