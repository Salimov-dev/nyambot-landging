"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Image from "next/image";
import { Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { theme } from "@/config/theme";
import { CheckIcon } from "@/components/ui/icons/icons";
import styles from "./integrations-section.module.css";

const { Title, Text } = Typography;

/** Роль подписывается под каждым логотипом: без неё список читается как
 *  требования к заведению, а не как необязательные дополнения */
const LOGOS = [
  { id: "iiko", src: "/images/integrations/iiko.png", role: "pos" },
  { id: "rkeeper", src: "/images/integrations/r-keeper.png", role: "pos" },
  { id: "yookassa", src: "/images/integrations/ukassa.png", role: "payment" },
  { id: "yandexPay", src: "/images/integrations/y-pay.png", role: "payment" },
  {
    id: "yandexDelivery",
    src: "/images/integrations/y-delivery.png",
    role: "delivery",
  },
] as const;

export function IntegrationsSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text
            style={{
              color: theme.colors.accent,
              fontSize: 14,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {t("integrations.label")}
          </Text>
          <Title
            level={2}
            style={{
              color: theme.colors.textPrimary,
              fontSize: "clamp(24px, 3.5vw, 38px)",
              fontWeight: 800,
              margin: "12px 0 0",
            }}
          >
            {t("integrations.title")}
          </Title>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: 16,
              lineHeight: 1.6,
              display: "block",
              marginTop: 12,
            }}
          >
            {t("integrations.subtitle")}
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={styles.logos}
        >
          {LOGOS.map((logo) => (
            <div key={logo.id} className={styles.logoItem}>
              <div className={styles.logoCard}>
                <Image
                  src={logo.src}
                  alt={t(`integrations.items.${logo.id}`)}
                  width={940}
                  height={404}
                  sizes="200px"
                  className={styles.logoImage}
                />
              </div>
              <span className={styles.logoRole}>
                {t(`integrations.roles.${logo.role}`)}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.noPosRow}
        >
          <span className={styles.noPos}>
            <CheckIcon size={16} />
            {t("integrations.noPos")}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
