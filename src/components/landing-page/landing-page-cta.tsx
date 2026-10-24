"use client";

import Link from "next/link";
import { LINKS } from "@/config/links.config";
import { LANDING_FROM_PARAM, reachGoal } from "@/config/metrika";
import styles from "./landing-page.module.css";

const CTA_TEXT = {
  /** Одна дорога, как на главной: запуск нашими руками. «Настрою сам» на
   *  регистрацию убрана — саморегистрация в СРМ закрыта (Руслан 17.10.2026). */
  primary: "Запустим за тебя бесплатно",
  /** MAX стоит первым везде в продукте — здесь тоже. */
  demoMax: "Демо в MAX",
  demoTelegram: "Демо в Телеграм",
  /** Отсюда человек уходит смотреть продукт целиком: посадочная отвечает на
   *  один запрос, а тарифы, возможности и вопросы живут на главной. */
  home: "Все возможности Нямбота",
  /** Условия под кнопками — те же, что пилюля первого экрана главной. */
  trial: "Цены открыты · без процента с заказа · QR-код на столах",
} as const;

type IProps = {
  /** Slug страницы («rabota-s-zalom») — в цели и в адрес `/zapusk`; нет — без него. */
  page: string | null;
};

/** Кнопки посадочной страницы: те же цели Метрики, что на главной, плюс
 *  страница — иначе конверсии этих страниц не отличить друг от друга. */
export function LandingPageCta({ page }: IProps) {
  const pageParam = page ? { page } : {};
  const zapuskHref = page
    ? `${LINKS.pages.zapusk}?${LANDING_FROM_PARAM}=${page}`
    : LINKS.pages.zapusk;
  return (
    <div className={styles.ctaBlock}>
      <div className={styles.ctaRow}>
        <Link
          href={zapuskHref}
          className={styles.primaryBtn}
          onClick={() =>
            reachGoal("click_trial", { to: "zapusk", ...pageParam })
          }
        >
          {CTA_TEXT.primary}
        </Link>
        <a
          href={LINKS.demo.fromLanding.max}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.secondaryBtn}
          onClick={() => reachGoal("click_max_demo", pageParam)}
        >
          {CTA_TEXT.demoMax}
        </a>
        <a
          href={LINKS.demo.fromLanding.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.secondaryBtn}
          onClick={() => reachGoal("click_tg_bot", pageParam)}
        >
          {CTA_TEXT.demoTelegram}
        </a>
        <Link href="/" className={styles.tertiaryBtn}>
          {CTA_TEXT.home}
          <span className={styles.tertiaryArrow} aria-hidden="true">
            →
          </span>
        </Link>
      </div>
      <p className={styles.trial}>{CTA_TEXT.trial}</p>
    </div>
  );
}
