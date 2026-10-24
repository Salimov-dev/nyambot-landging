"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { useHasTranslation } from "@/hooks/use-has-translation.hook";
import { StepVideo } from "@/components/ui/step-video/step-video";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import {
  LICENSE_MODULE,
  moduleMonthlyRub,
} from "@/config/modules-pricing.config";
import { HALL_POINTS, HALL_VIDEO, HallPoint } from "./hall-section.config";
import styles from "./hall-section.module.css";

const { Title, Text } = Typography;

/**
 * «Работа с залом» — после «Пути гостя» (Ф10б п. 1, Руслан 21.10.2026: «важный
 * блок»; 24.10.2026: QR на столе — главное УТП после доставки, идёт первым,
 * бронь — второй): кроме доставки и самовывоза, Нямбот работает и в зале — QR на столе,
 * официант или «заберу сам», бронь с предзаказом сразу в кассе, заказ ко
 * времени. Это модуль — так и написано, без мелкого шрифта, а тексты — через
 * выгоду ресторатора: больше заказов, без звонков и ожидания (24.10.2026).
 *
 * Тексты пока только в ru-локали: на другом языке блок не рисуется
 * (`useHasTranslation`) — появится сам, когда придут переводы.
 */
export function HallSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const hasText = useHasTranslation("hallBlock.title");
  const videoRef = useRef<HTMLVideoElement>(null);
  // Пункт, чей шаг идёт в ролике, подсвечен — как роли у «Команды»
  const [activePoint, setActivePoint] = useState<HallPoint | null>(
    HallPoint.table,
  );
  const onPointChange = useCallback(
    (point: HallPoint | null) => setActivePoint(point),
    [],
  );

  if (!hasText) return null;

  const price = moduleMonthlyRub(LICENSE_MODULE.HALL).toLocaleString("ru-RU");

  return (
    <section id="hall" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text className={styles.label}>
            {t("hallBlock.label")}
            <span className={styles.moduleTag}>{t("hallBlock.moduleTag")}</span>
          </Text>
          <Title level={2} className={styles.title}>
            {t("hallBlock.title")}
          </Title>
          <Text className={styles.subtitle}>{t("hallBlock.subtitle")}</Text>
        </motion.div>

        <div className={styles.layout}>
          {/* Ролик: QR на столе → заказ на столе в кассе → бронь в кассе.
              Подписи под ним нет — пункт его шага подсвечен в списке */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={styles.videoCol}
          >
            <StepVideo
              src={HALL_VIDEO.src}
              poster={HALL_VIDEO.poster}
              steps={HALL_VIDEO.steps}
              videoRef={videoRef}
              onGroupChange={onPointChange}
              showCaption={false}
            />
          </motion.div>

          <motion.ol
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.16 }}
            className={styles.points}
          >
            {HALL_POINTS.map((point, index) => (
              <li
                key={point}
                className={`${styles.point} ${activePoint === point ? styles.pointActive : ""}`}
                aria-current={activePoint === point ? "step" : undefined}
              >
                <span className={styles.num}>{index + 1}</span>
                <span className={styles.pointBody}>
                  <span className={styles.pointTitle}>
                    {t(`hallBlock.points.${point}.title`)}
                  </span>
                  <span className={styles.pointText}>
                    {t(`hallBlock.points.${point}.text`)}
                  </span>
                </span>
              </li>
            ))}
          </motion.ol>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.24 }}
          className={styles.footer}
        >
          <span className={styles.note}>
            {t("hallBlock.moduleNote", { price })}
          </span>
          <Button
            type="primary"
            size="large"
            href={LINKS.pages.hall}
            className={styles.moreBtn}
            onClick={() =>
              reachGoal("click_solution", { page: "hall", from: "home_hall" })
            }
          >
            {t("hallBlock.more")}
          </Button>
          {/* QR на столе — главное в зале: отдельная дорога на страницу
              QR-меню с заказом (Руслан 24.10.2026) */}
          <Link href={LINKS.pages.electronicMenu} className={styles.menuLink}>
            {t("hallBlock.menuLink")} →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
