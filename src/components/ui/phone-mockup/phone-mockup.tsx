import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./phone-mockup.module.css";

interface PhoneMockupProps {
  children?: ReactNode;
  className?: string;
}

export function PhoneMockup({ children, className }: PhoneMockupProps) {
  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <div className={styles.phone}>
        <Image
          src="/images/phone-body.png"
          alt="Нямбот — мини-приложение в мессенджере"
          fill
          className={styles.frame}
          priority
          sizes="(max-width: 480px) 200px, (max-width: 900px) 230px, 280px"
        />
        <div className={styles.screen}>{children}</div>
      </div>
    </div>
  );
}
