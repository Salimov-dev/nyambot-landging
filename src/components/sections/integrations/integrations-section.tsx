"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Image from "next/image";
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
import styles from "./integrations-section.module.css";
import { INTEGRATIONS_VIDEO, VideoCash } from "./integrations-video.config";

const { Title, Text } = Typography;

const VIDEO_CASHES: ReadonlySet<string> = new Set(Object.values(VideoCash));
const isVideoCash = (id: string): id is VideoCash => VIDEO_CASHES.has(id);

/** 🔴 Подписи ролей под логотипами сняты 14.09.2026: «интеграция с кассой» под
 *  логотипом iiko ничего не добавляет — логотип и так узнаётся, — зато делает
 *  колонки разной высоты, и ряд карточек разъезжается по вертикали. */
const LOGOS = [
  { id: "iiko", src: "/images/integrations/iiko.png" },
  { id: "rkeeper", src: "/images/integrations/r-keeper.png" },
  { id: "yookassa", src: "/images/integrations/ukassa.png" },
  { id: "yandexPay", src: "/images/integrations/y-pay.png" },
  { id: "yandexDelivery", src: "/images/integrations/y-delivery.png" },
] as const;

export function IntegrationsSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeCash, setActiveCash] = useState<VideoCash | null>(
    VideoCash.iiko,
  );
  const onCashChange = useCallback(
    (cash: VideoCash | null) => setActiveCash(cash),
    [],
  );

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
          {LOGOS.map((logo) => {
            const image = (
              <Image
                src={logo.src}
                alt={t(`integrations.items.${logo.id}`)}
                width={940}
                height={404}
                sizes="200px"
                className={styles.logoImage}
              />
            );
            // Логотип кассы из ролика подсвечен, пока идёт её часть; нажатие —
            // переход к ней
            const cash = isVideoCash(logo.id) ? logo.id : null;
            return (
              <div key={logo.id} className={styles.logoItem}>
                {cash ? (
                  <button
                    type="button"
                    className={`${styles.logoCard} ${styles.logoButton} ${
                      activeCash === cash ? styles.logoCardActive : ""
                    }`}
                    aria-pressed={activeCash === cash}
                    onClick={() =>
                      playVideoFrom(
                        videoRef.current,
                        INTEGRATIONS_VIDEO.start[cash],
                      )
                    }
                  >
                    {image}
                  </button>
                ) : (
                  <div className={styles.logoCard}>{image}</div>
                )}
              </div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          <StepVideo
            src={INTEGRATIONS_VIDEO.src}
            poster={INTEGRATIONS_VIDEO.poster}
            steps={INTEGRATIONS_VIDEO.steps}
            videoRef={videoRef}
            onGroupChange={onCashChange}
            className={styles.videoWrap}
          />
        </motion.div>

        {/* Ссылки рядом с логотипами касс: тому, кто узнал свою кассу,
            дальше нужна не общая страница, а разбор именно этой интеграции */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className={styles.moreRow}
        >
          <Link href={LINKS.pages.iiko} className={styles.moreLink}>
            {t("integrations.moreIiko")}
          </Link>
          <Link href={LINKS.pages.rkeeper} className={styles.moreLink}>
            {t("integrations.moreRkeeper")}
          </Link>
          <Link href={LINKS.pages.integrations} className={styles.moreLink}>
            {t("integrations.moreAll")}
          </Link>
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
