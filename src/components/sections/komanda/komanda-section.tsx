"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Link from "next/link";
import { Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { theme } from "@/config/theme";
import { LINKS } from "@/config/links.config";
import { CheckIcon } from "@/components/ui/icons/icons";
import {
  StepVideo,
  playVideoFrom,
} from "@/components/ui/step-video/step-video";
import { KOMANDA_VIDEO, KomandaRole } from "./komanda-video.config";
import styles from "./komanda-section.module.css";

const { Title, Text } = Typography;

const ROLES = [
  KomandaRole.cook,
  KomandaRole.admin,
  KomandaRole.courier,
] as const;

/** Приложение «Команда»: один заказ проходит смену — повар, администратор,
 *  курьер, каждый со своего устройства (Руслан 06.10.2026) */
export function KomandaSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeRole, setActiveRole] = useState<KomandaRole | null>(
    KomandaRole.cook,
  );
  const onRoleChange = useCallback(
    (role: KomandaRole | null) => setActiveRole(role),
    [],
  );

  return (
    <section id="komanda" className={styles.section}>
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
            {t("komanda.label")}
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
            {t("komanda.title")}
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
            {t("komanda.subtitle")}
          </Text>
        </motion.div>

        {/* Роль, чей шаг идёт в ролике, подсвечена; нажатие — переход к её шагу */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={styles.roles}
        >
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              className={`${styles.role} ${activeRole === role ? styles.roleActive : ""}`}
              aria-pressed={activeRole === role}
              onClick={() =>
                playVideoFrom(videoRef.current, KOMANDA_VIDEO.start[role])
              }
            >
              {t(`komanda.roles.${role}`)}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          <StepVideo
            src={KOMANDA_VIDEO.src}
            poster={KOMANDA_VIDEO.poster}
            steps={KOMANDA_VIDEO.steps}
            videoRef={videoRef}
            onGroupChange={onRoleChange}
            className={styles.videoWrap}
          />
        </motion.div>

        {/* Честная граница: с iiko кухней и курьерами управляет касса */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className={styles.noteRow}
        >
          <span className={styles.note}>
            <CheckIcon size={16} />
            {t("komanda.note")}
          </span>
          <Link href={LINKS.pages.komanda} className={styles.moreLink}>
            {t("komanda.more")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
