"use client";

import { useCallback, useRef, useState } from "react";
import { Button, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useHasTranslation } from "@/hooks/use-has-translation.hook";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import {
  StepVideo,
  playVideoFrom,
} from "@/components/ui/step-video/step-video";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import {
  LICENSE_MODULE,
  moduleMonthlyRub,
} from "@/config/modules-pricing.config";
import styles from "../hall/hall-section.module.css";

const POINT = { ORDER: "order", PACK: "pack", DELIVERY: "delivery" } as const;
const POINTS = Object.values(POINT);
type CorporatePoint = (typeof POINT)[keyof typeof POINT];
export const CORPORATE_VIDEO = {
  src: "/videos/home/corporate/office-lunches.mp4",
  poster: "/videos/home/corporate/office-lunches-poster.jpg",
  steps: [
    { from: 0, group: POINT.ORDER, key: "corporateBlock.points.order.title" },
    { from: 9, group: POINT.PACK, key: "corporateBlock.points.pack.title" },
    {
      from: 18,
      group: POINT.DELIVERY,
      key: "corporateBlock.points.delivery.title",
    },
  ],
};

export function CorporateSection() {
  const { t } = useTranslation("landing");
  const hasText = useHasTranslation("corporateBlock.title");
  const { ref, isInView } = useScrollAnimation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activePoint, setActivePoint] = useState<CorporatePoint | null>(
    POINT.ORDER,
  );
  const onGroupChange = useCallback(
    (point: CorporatePoint | null) => setActivePoint(point),
    [],
  );
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
        <div className={styles.layout}>
          <div
            className={styles.videoCol}
            style={{ maxWidth: 430, margin: "0 auto" }}
          >
            <StepVideo
              aspectRatio={480 / 1000}
              src={CORPORATE_VIDEO.src}
              poster={CORPORATE_VIDEO.poster}
              steps={CORPORATE_VIDEO.steps}
              videoRef={videoRef}
              onGroupChange={onGroupChange}
              showCaption={false}
            />
          </div>
          <ol className={styles.points}>
            {POINTS.map((point, index) => (
              <li
                key={point}
                className={
                  index === POINTS.length - 1 ? styles.pointWide : undefined
                }
              >
                <button
                  type="button"
                  className={`${styles.point} ${activePoint === point ? styles.pointActive : ""}`}
                  aria-current={activePoint === point ? "step" : undefined}
                  onClick={() =>
                    playVideoFrom(
                      videoRef.current,
                      CORPORATE_VIDEO.steps[index].from,
                    )
                  }
                >
                  <span className={styles.num}>{index + 1}</span>
                  <span className={styles.pointBody}>
                    <strong className={styles.pointTitle}>
                      {t(`corporateBlock.points.${point}.title`)}
                    </strong>
                    <span className={styles.pointText}>
                      {t(`corporateBlock.points.${point}.text`)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.footer}>
          <p className={styles.note}>
            {t("corporateBlock.price", {
              price: moduleMonthlyRub(LICENSE_MODULE.CORPORATE).toLocaleString(
                "ru-RU",
              ),
            })}
          </p>
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
        </div>
      </div>
    </section>
  );
}
