"use client";

import Link from "next/link";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import styles from "./landing-page.module.css";

const CTA_TEXT = {
  primary: "Начать бесплатно",
  /** MAX стоит первым везде в продукте — здесь тоже. */
  demoMax: "Демо в MAX",
  demoTelegram: "Демо в Телеграм",
  /** Отсюда человек уходит смотреть продукт целиком: посадочная отвечает на
   *  один запрос, а тарифы, возможности и вопросы живут на главной. */
  home: "Все возможности Нямбота",
  trial:
    "90 дней бесплатно · нужна только почта · без карты и звонка менеджера",
} as const;

/** Кнопки посадочной страницы: те же цели Метрики, что на главной, — иначе
 *  конверсии этих страниц не отличить от прямых заходов. */
export function LandingPageCta() {
  return (
    <div className={styles.ctaBlock}>
      <div className={styles.ctaRow}>
        <a
          href={LINKS.crm}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.primaryBtn}
          onClick={() => reachGoal("click_trial")}
        >
          {CTA_TEXT.primary}
        </a>
        <a
          href={LINKS.demo.max}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.secondaryBtn}
          onClick={() => reachGoal("click_max_demo")}
        >
          {CTA_TEXT.demoMax}
        </a>
        <a
          href={LINKS.demo.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.secondaryBtn}
          onClick={() => reachGoal("click_tg_bot")}
        >
          {CTA_TEXT.demoTelegram}
        </a>
        <Link href="/" className={styles.tertiaryBtn}>
          {CTA_TEXT.home}
        </Link>
      </div>
      <p className={styles.trial}>{CTA_TEXT.trial}</p>
    </div>
  );
}
