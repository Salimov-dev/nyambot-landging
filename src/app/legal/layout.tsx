import type { ReactNode } from "react";
import Link from "next/link";
import { BRAND_CONFIG } from "@/config/brand.config";
import styles from "./legal.module.css";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          ← {BRAND_CONFIG.name}
        </Link>
      </header>
      <main className={styles.content}>{children}</main>
      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} {BRAND_CONFIG.name}
        </span>
      </footer>
    </div>
  );
}
