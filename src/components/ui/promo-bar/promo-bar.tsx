"use client";

import { useTranslation } from "react-i18next";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import styles from "./promo-bar.module.css";

export function PromoBar() {
  const { t } = useTranslation("landing");

  return (
    <div className={styles.bar}>
      <span className={styles.text}>{t("promoBar.text")}</span>
      <a
        href={LINKS.crm}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cta}
        onClick={() => reachGoal("click_trial")}
      >
        {t("promoBar.cta")} →
      </a>
    </div>
  );
}
