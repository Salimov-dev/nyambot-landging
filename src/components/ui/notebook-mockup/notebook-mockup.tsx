import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./notebook-mockup.module.css";

interface NotebookMockupProps {
  children?: ReactNode;
  className?: string;
}

export function NotebookMockup({ children, className }: NotebookMockupProps) {
  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <div className={styles.notebook}>
        <Image
          src="/images/notebook_body.png"
          alt="Нямбот CRM — управление рестораном"
          fill
          className={styles.frame}
          priority
          sizes="(max-width: 768px) 100vw, 640px"
        />
        <div className={styles.screen}>{children}</div>
      </div>
    </div>
  );
}
