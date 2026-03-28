import type { ReactNode } from "react";
import { IPhoneFrame } from "./iphone-frame";
import styles from "./phone-mockup.module.css";

interface PhoneMockupProps {
  children?: ReactNode;
  className?: string;
}

export function PhoneMockup({ children, className }: PhoneMockupProps) {
  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <div className={styles.phone}>
        <IPhoneFrame className={styles.frame} />
        <div className={styles.screen}>{children}</div>
      </div>
    </div>
  );
}
