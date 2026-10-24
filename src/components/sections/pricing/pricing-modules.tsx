"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CheckIcon } from "@/components/ui/icons/icons";
import { useHasTranslation } from "@/hooks/use-has-translation.hook";
import { LINKS } from "@/config/links.config";
import {
  LICENSE_MODULE,
  LICENSE_MODULES,
  MODULES_PRICING,
  type ILicenseModule,
} from "@/config/modules-pricing.config";
import { ModuleTerms } from "@/components/landing-page/module-terms";
import {
  CONTACT_WIDGET_SOURCE,
  openContactWidget,
} from "@/components/ui/contact-widget/contact-widget.events";
import styles from "./pricing-modules.module.css";

/** Что даёт модуль — ключи `pricing.modules.items.<модуль>.points.<ключ>`:
 *  каждый пункт — «выгода: как» (Руслан 24.10.2026) */
const MODULE_POINT = {
  BOOKING: "booking",
  SCHEDULED: "scheduled",
  TABLE: "table",
  ANSWERS: "answers",
  MENU: "menu",
  ADMIN: "admin",
} as const;
type IModulePoint = (typeof MODULE_POINT)[keyof typeof MODULE_POINT];

const MODULE_POINTS: Record<ILicenseModule, readonly IModulePoint[]> = {
  [LICENSE_MODULE.HALL]: [
    MODULE_POINT.BOOKING,
    MODULE_POINT.SCHEDULED,
    MODULE_POINT.TABLE,
  ],
  [LICENSE_MODULE.AI_CHAT]: [
    MODULE_POINT.ANSWERS,
    MODULE_POINT.MENU,
    MODULE_POINT.ADMIN,
  ],
};

/** Куда ведёт «Подробнее»: у зала свой хаб, у ИИ — раздел на странице модулей */
const MODULE_MORE_HREF: Record<ILicenseModule, string> = {
  [LICENSE_MODULE.HALL]: LINKS.pages.hall,
  [LICENSE_MODULE.AI_CHAT]: LINKS.pages.modules,
};

/** Условия модулей — ключи `pricing.modules.rules.<ключ>` */
const MODULE_RULE = {
  LICENSE: "license",
  TERM: "term",
  ANYTIME: "anytime",
} as const;

const MODULE_RULES = Object.values(MODULE_RULE);

const formatRub = (value: number): string => value.toLocaleString("ru-RU");

/**
 * Модули под тарифами (план «Работа с залом», Ф10б п. 2, Р21: понятно с
 * первого взгляда). Тарифы выше — это сам Нямбот, модули расширяют его: тексты
 * — через выгоду ресторатора, условия (к лицензии, цена за точку) — спокойным
 * фактом, без «по желанию» и «за доплату» (Руслан 24.10.2026). Цены — из
 * `modules-pricing.config.ts`, одной константы с остальным лендингом.
 *
 * Цены за 3, 6 и 12 месяцев — строками, как на странице /moduli, с бейджем
 * выгоды «−10%» тем же зелёным, что у тарифов лицензии (`ModuleTerms`; месяц
 * не повторяем — он крупно выше). Карточки — на общей сетке (subgrid): тег,
 * название, цена, пункты, сроки, условие и «Подробнее» у обеих стоят на одних
 * уровнях, «Подробнее» прижата к низу.
 *
 * Тексты пока только в ru-локали: на другом языке блок не рисуется.
 */
export function PricingModules({ isInView }: { isInView: boolean }) {
  const { t } = useTranslation("landing");
  const hasText = useHasTranslation("pricing.modules.title");

  if (!hasText) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.35 }}
      className={styles.modules}
      id="modules"
    >
      <div className={styles.head}>
        <h3 className={styles.title}>{t("pricing.modules.title")}</h3>
        <p className={styles.subtitle}>{t("pricing.modules.subtitle")}</p>
      </div>

      <div className={styles.grid}>
        {LICENSE_MODULES.map((licenseModule) => (
          <article key={licenseModule} className={styles.card}>
            <span className={styles.tag}>{t("pricing.modules.tag")}</span>
            <h4 className={styles.name}>
              {t(`pricing.modules.items.${licenseModule}.name`)}
            </h4>
            <p className={styles.price}>
              <span className={styles.priceValue}>
                {formatRub(MODULES_PRICING[licenseModule].priceRub[1])} ₽
              </span>
              <span className={styles.perMonth}>
                {t("pricing.modules.perMonth")}
              </span>
            </p>

            <ul className={styles.points}>
              {MODULE_POINTS[licenseModule].map((point) => (
                <li key={point} className={styles.point}>
                  <CheckIcon size={16} />
                  {t(`pricing.modules.items.${licenseModule}.points.${point}`)}
                </li>
              ))}
            </ul>

            <ModuleTerms
              module={licenseModule}
              longTermsOnly
              className={styles.terms}
            />

            <p className={styles.note}>
              {t(`pricing.modules.items.${licenseModule}.note`)}
            </p>

            <Link
              href={MODULE_MORE_HREF[licenseModule]}
              className={styles.more}
            >
              {t("pricing.modules.more")} →
            </Link>
          </article>
        ))}
      </div>

      <ul className={styles.rules}>
        {MODULE_RULES.map((rule) => (
          <li key={rule} className={styles.rule}>
            {t(`pricing.modules.rules.${rule}`)}
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <Link href={LINKS.pages.modules} className={styles.more}>
          {t("pricing.modules.allCta")} →
        </Link>
        {/* Канал гость выбирает сам: кнопка связи — MAX, Телеграм и почта */}
        <button
          type="button"
          className={`${styles.more} ${styles.moreButton}`}
          onClick={() =>
            openContactWidget(CONTACT_WIDGET_SOURCE.PRICING_MODULES)
          }
        >
          {t("pricing.modules.askCta")} →
        </button>
      </div>
    </motion.div>
  );
}
