"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { useHasTranslation } from "@/hooks/use-has-translation.hook";
import { PhoneMockup } from "@/components/ui/phone-mockup/phone-mockup";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import {
  LICENSE_MODULE,
  moduleMonthlyRub,
} from "@/config/modules-pricing.config";
import { HallPhoneScreen } from "./hall-phone-screen";
import { HALL_POINTS } from "./hall-section.config";
import styles from "./hall-section.module.css";

const { Title, Text } = Typography;

/**
 * «Работа с залом» — после «Пути гостя» (Ф10б п. 1, Руслан 21.10.2026: «важный
 * блок»): кроме доставки и самовывоза, Нямбот работает и в зале — QR на столе,
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
          {/* Место ролика: пока он не собран — кадр бота за столом */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={styles.phoneCol}
          >
            <PhoneMockup>
              <HallPhoneScreen />
            </PhoneMockup>
          </motion.div>

          <motion.ol
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.16 }}
            className={styles.points}
          >
            {HALL_POINTS.map((point, index) => (
              <li key={point} className={styles.point}>
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
        </motion.div>
      </div>
    </section>
  );
}
