import Link from "next/link";
import type { ReactNode } from "react";
import { BRAND_CONFIG } from "@/config/brand.config";
import { LINKS } from "@/config/links.config";
import { StructuredData } from "@/components/common/structured-data/structured-data";
import styles from "./landing-page.module.css";

const SHELL_TEXT = {
  home: "На главную",
  legal: "Публичная оферта",
  rights: "Все права защищены",
} as const;

/**
 * Каркас отдельной страницы лендинга: свечение, шапка с возвратом на главную
 * и подвал. Общий у посадочных под запросы и у страницы заявки `/zapusk` —
 * страница должна читаться как часть сайта, а не как отдельный документ.
 *
 * Шапка своя, а не главная: у главной пункты меню — якоря вида «#pricing», и
 * на отдельной странице они вели бы в никуда.
 */
export function LandingPageShell({
  children,
  wide = false,
}: {
  children: ReactNode;
  /** Шире обычной посадочной: страница с формой рядом с текстом. */
  wide?: boolean;
}) {
  return (
    <div className={wide ? `${styles.page} ${styles.pageWide}` : styles.page}>
      <StructuredData />
      <div className={styles.glow} />

      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          {BRAND_CONFIG.name}
        </Link>
        {/* Возврат на главную — кнопка со стрелкой, а не слово в углу:
            словом «Главная» его не замечали */}
        <Link href="/" className={styles.homeLink}>
          <span aria-hidden="true">←</span> {SHELL_TEXT.home}
        </Link>
      </header>

      {children}

      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} {BRAND_CONFIG.name} · {SHELL_TEXT.rights}
        </span>
        <Link href={LINKS.legal.offer} className={styles.footerLink}>
          {SHELL_TEXT.legal}
        </Link>
      </footer>
    </div>
  );
}
