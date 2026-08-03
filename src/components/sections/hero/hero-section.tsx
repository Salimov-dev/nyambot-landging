"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";
import { Button, Flex, Typography } from "antd";
import { PhoneMockup } from "@/components/ui/phone-mockup/phone-mockup";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import { theme } from "@/config/theme";
import {
  getSkolkovoLogo,
  getSkolkovoLogoSize,
  SKOLKOVO_LOGO_KIND,
} from "@/config/skolkovo.config";
import { CheckIcon } from "@/components/ui/icons/icons";
import styles from "./hero-section.module.css";

const { Title, Text } = Typography;

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const phoneVariants: Variants = {
  hidden: { opacity: 0, x: 60, scale: 0.92 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
  },
};

export function HeroSection() {
  const { t, i18n } = useTranslation("landing");
  const videoRef = useRef<HTMLVideoElement>(null);
  const skolkovoLogo = getSkolkovoLogo(
    i18n.language,
    SKOLKOVO_LOGO_KIND.HORIZONTAL,
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play();
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="hero" className={styles.section}>
      {/* Glow фон */}
      <div className={styles.glow} />

      <div className={styles.inner}>
        <Flex
          align="center"
          justify="space-between"
          gap={48}
          className={styles.content}
        >
          {/* Левая колонка — текст */}
          <motion.div
            className={styles.textCol}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Надзаголовочной пилюли нет: она повторяла «бот на всю сеть» из
                заголовка, а вместе с пилюлей триала зажимала блок в две рамки.
                «Для одной точки и для сети» не потеряно — оно открывает
                подзаголовок, чтобы одиночная точка не решила, что сервис не про неё */}
            <motion.div variants={itemVariants}>
              <Title level={1} className={styles.title}>
                <span dangerouslySetInnerHTML={{ __html: t("hero.title") }} />
              </Title>
            </motion.div>

            {/* Первый экран несёт одну мысль. Перечень интеграций отсюда убран:
                ресторатору без кассы он читался как список требований к нему —
                интеграции живут в своей секции с пометкой «по желанию» */}
            <motion.div variants={itemVariants}>
              <Text className={styles.subtitle}>{t("hero.subtitle")}</Text>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Flex gap={12} wrap className={styles.ctaRow}>
                <Button
                  type="primary"
                  size="large"
                  href={LINKS.crm}
                  target="_blank"
                  className={styles.primaryBtn}
                  onClick={() => reachGoal("click_trial")}
                >
                  {t("hero.cta")}
                </Button>
                <Button
                  type="default"
                  size="large"
                  href="#try-demo"
                  className={styles.secondaryBtn}
                  onClick={() => reachGoal("click_features")}
                >
                  {t("hero.ctaSecondary")}
                </Button>
              </Flex>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Flex gap={10} wrap className={styles.pills}>
                <span className={styles.trialPill}>
                  <CheckIcon size={16} />
                  {t("hero.trial")}
                </span>
                {/* Знак участника «Сколково» живёт в шапке, но на телефонах он
                    туда не помещается рядом с бургером — там показываем его
                    здесь, чтобы статус не пропал с первого экрана */}
                <a
                  href={LINKS.skolkovo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.skolkovoLink}
                  aria-label={t("skolkovo.alt")}
                >
                  {/* 44 px вместо минимальных 34: этот знак виден только на
                      телефонах, где экран узкий и мелкий логотип теряется */}
                  <Image
                    src={skolkovoLogo.src}
                    alt={t("skolkovo.alt")}
                    {...getSkolkovoLogoSize(skolkovoLogo, 44)}
                    className={styles.skolkovoLogo}
                  />
                </a>
              </Flex>
            </motion.div>
          </motion.div>

          {/* Правая колонка — телефон */}
          <motion.div
            className={styles.phoneCol}
            variants={phoneVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.phoneWrapper}>
              <div className={styles.phoneGlow} />
              <PhoneMockup>
                <video
                  ref={videoRef}
                  src="/videos/phone/hero-intro.mp4"
                  poster="/videos/phone/hero-intro-poster.jpg"
                  className={styles.phoneScreenImage}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </PhoneMockup>
            </div>
          </motion.div>
        </Flex>
      </div>
    </section>
  );
}
