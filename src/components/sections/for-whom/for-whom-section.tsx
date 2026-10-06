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

const { Title } = Typography;

const SEGMENTS = [
  { id: "cafe", icon: UtensilsIcon },
  { id: "bakery", icon: ChefHatIcon },
  { id: "dark", icon: BoxIcon },
  { id: "chains", icon: StoreIcon },
  { id: "production", icon: FactoryIcon },
] as const;

/**
 * Форматы заведений — одним рядом «иконка + название», без карточек.
 *
 * 🔴 Пять плиток с рамками занимали экран телефона ради пяти коротких слов
 * (Руслан 06.10.2026). Блок отвечает на «это для меня?» с одного взгляда,
 * читать в нём нечего — поэтому ряд, который на телефоне переносится в две-три
 * строки.
 */
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

        <ul className={styles.row}>
          {SEGMENTS.map((segment, i) => (
            <motion.li
              key={segment.id}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className={styles.item}
            >
              <span className={styles.icon} aria-hidden="true">
                <segment.icon size={18} />
              </span>
              {t(`forWhom.items.${segment.id}.title`)}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
