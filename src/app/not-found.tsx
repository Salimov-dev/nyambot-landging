import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_CONFIG } from "@/config/brand.config";
import styles from "./not-found.module.css";

/** Тексты здесь русские, без i18next: страница серверная и рендерится до того,
 *  как клиент выберет язык, а сам адрес — всегда результат опечатки или
 *  устаревшей ссылки. Переводить её ради этого не за чем. */
const NOT_FOUND_TEXT = {
  code: "404",
  title: "Такой страницы нет",
  text: "Ссылка устарела или в адресе опечатка. На главной — всё про Нямбот: заказы и доставка еды в MAX и Телеграм, одним ботом на всю сеть.",
  action: "На главную",
} as const;

/** Своего адреса у ненайденной страницы нет, поэтому нет и canonical: её задача
 *  — сказать поиску «не индексируй», а ссылки со страницы обойти можно. */
export const metadata: Metadata = {
  title: { absolute: `Страница не найдена | ${BRAND_CONFIG.name}` },
  description: NOT_FOUND_TEXT.text,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.code}>{NOT_FOUND_TEXT.code}</div>
        <h1 className={styles.title}>{NOT_FOUND_TEXT.title}</h1>
        <p className={styles.text}>{NOT_FOUND_TEXT.text}</p>
        <Link href="/" className={styles.button}>
          {NOT_FOUND_TEXT.action}
        </Link>
      </div>
    </div>
  );
}
