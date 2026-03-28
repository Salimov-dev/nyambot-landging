import type { ReactNode } from "react";
import { MacBookFrame } from "./macbook-frame";
import styles from "./notebook-mockup.module.css";

interface NotebookMockupProps {
  children?: ReactNode;
  className?: string;
}

export function NotebookMockup({ children, className }: NotebookMockupProps) {
  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <div className={styles.notebook}>
        <MacBookFrame className={styles.frame} />
        <div className={styles.screen}>{children}</div>
      </div>
    </div>
  );
}
