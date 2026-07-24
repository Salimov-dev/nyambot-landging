"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { theme } from "@/config/theme";
import styles from "./for-whom-section.module.css";
import {
  UtensilsIcon,
  ChefHatIcon,
  BoxIcon,
  StoreIcon,
  FactoryIcon,
} from "@/components/ui/icons/icons";

const { Title, Text } = Typography;

const SEGMENTS = [
  { id: "cafe", icon: UtensilsIcon },
  { id: "bakery", icon: ChefHatIcon },
  { id: "dark", icon: BoxIcon },
  { id: "chains", icon: StoreIcon },
  { id: "production", icon: FactoryIcon },
] as const;

export function ForWhomSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="for-whom" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Title
            level={2}
            style={{
              color: theme.colors.textPrimary,
              fontSize: "clamp(24px, 3.5vw, 38px)",
              fontWeight: 800,
              margin: 0,
            }}
          >
            {t("forWhom.title")}
          </Title>
        </motion.div>

        <div className={styles.grid}>
          {SEGMENTS.map((segment, i) => (
            <motion.div
              key={segment.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={styles.card}
            >
              <span className={styles.icon}>
                <segment.icon size={26} />
              </span>
              <Title
                level={4}
                style={{
                  color: theme.colors.textPrimary,
                  fontSize: 17,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                {t(`forWhom.items.${segment.id}.title`)}
              </Title>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
