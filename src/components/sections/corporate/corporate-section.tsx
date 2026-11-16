"use client";

import { Button, Typography } from "antd";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useHasTranslation } from "@/hooks/use-has-translation.hook";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import {
  LICENSE_MODULE,
  moduleMonthlyRub,
} from "@/config/modules-pricing.config";
import styles from "../hall/hall-section.module.css";
import corporateStyles from "./corporate-section.module.css";

const POINTS = ["order", "pack", "delivery", "office"] as const;

export function CorporateSection() {
  const { t } = useTranslation("landing");
  const hasText = useHasTranslation("corporateBlock.title");
  const { ref, isInView } = useScrollAnimation();
  const isCorporatePage = usePathname() === LINKS.pages.corporateLunches;
  if (!hasText) return null;
  return (
    <section id="corporate-lunches" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Typography.Text className={styles.label}>
            {t("corporateBlock.label")}
          </Typography.Text>
          <Typography.Title level={2} className={styles.title}>
            {t("corporateBlock.title")}
          </Typography.Title>
          <Typography.Text className={styles.subtitle}>
            {t("corporateBlock.subtitle")}
          </Typography.Text>
        </motion.div>
        <ol className={styles.points}>
          {POINTS.map((point, index) => (
            <li key={point}>
              <div className={`${styles.point} ${corporateStyles.point}`}>
                <span className={styles.num}>{index + 1}</span>
                <span className={styles.pointBody}>
                  <strong className={styles.pointTitle}>
                    {t(`corporateBlock.points.${point}.title`)}
                  </strong>
                  <span className={styles.pointText}>
                    {t(`corporateBlock.points.${point}.text`)}
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.footer}>
          <p className={styles.note}>
            {t("corporateBlock.price", {
              price: moduleMonthlyRub(LICENSE_MODULE.CORPORATE).toLocaleString(
                "ru-RU",
              ),
            })}
          </p>
          {!isCorporatePage && (
            <Button
              type="primary"
              size="large"
              href={LINKS.pages.corporateLunches}
              className={styles.moreBtn}
              onClick={() =>
                reachGoal("click_solution", {
                  page: "corporate-lunches",
                  from: "home_corporate",
                })
              }
            >
              {t("corporateBlock.more")}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
