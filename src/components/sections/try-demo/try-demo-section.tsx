"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button, Flex, Tag, Typography } from "antd";
import { PhoneMockup } from "@/components/ui/phone-mockup/phone-mockup";
import { MockupVideo } from "@/components/ui/mockup-video/mockup-video";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { TelegramIcon } from "@/components/ui/messenger-icons/telegram-icon";
import { MaxIcon } from "@/components/ui/messenger-icons/max-icon";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import { theme } from "@/config/theme";
import { HandIcon, CheckIcon } from "@/components/ui/icons/icons";
import { DemoQrBlock } from "./demo-qr-block";
import styles from "./try-demo-section.module.css";

const { Title, Text } = Typography;

/** Ролик собирается в docs-nyambot/marketing/video/roliki/glavnaya/demo-otkrytie */
const DEMO_VIDEO = {
  src: "/videos/home/demo/otkrytie.mp4",
  poster: "/videos/home/demo/otkrytie-poster.jpg",
} as const;

export function TryDemoSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="try-demo" className={styles.section}>
      <div className={styles.glow} />
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Tag
            style={{
              background: theme.colors.accentBg,
              border: `1px solid ${theme.colors.accentBorder}`,
              color: theme.colors.accent,
              borderRadius: "var(--radius-pill)",
              padding: "4px 14px",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <Flex align="center" gap={6}>
              <HandIcon size={14} />
              {t("tryDemo.tag")}
            </Flex>
          </Tag>

          <Title
            level={2}
            style={{
              color: theme.colors.textPrimary,
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              margin: "16px 0 12px",
            }}
          >
            {t("tryDemo.title")}
          </Title>

          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: 17,
              lineHeight: 1.65,
              display: "block",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            {t("tryDemo.subtitle")}
          </Text>

          {/* Главное отличие демо: меню открывается без телефона и геолокации.
              Отдельной плашкой, иначе тонет в подзаголовке */}
          <span className={styles.noAuthPill}>
            <CheckIcon size={16} />
            {t("tryDemo.noAuth")}
          </span>
        </motion.div>

        {/* Один телефон с роликом «как гость открывает демо» вместо двух
            одинаковых статичных скриншотов (план «Видео продукта на лендинге»,
            Ф7): ролик начинается со страницы выбора — той самой, что открывает
            QR-код справа. Рядом — настоящие кнопки демо и QR */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
          className={styles.demoLayout}
        >
          <div className={styles.phoneWrap}>
            <div className={styles.phoneGlow} />
            <PhoneMockup>
              <MockupVideo src={DEMO_VIDEO.src} poster={DEMO_VIDEO.poster} />
            </PhoneMockup>
          </div>

          <div className={styles.demoSide}>
            <div className={styles.messengerCard}>
              <MaxIcon size={40} />
              {/* Мессенджер называют иконка и кнопка — в подписи не повторяем */}
              <span className={styles.messengerDesc}>
                {t("tryDemo.appDemo")}
              </span>
              <Button
                type="primary"
                size="large"
                href={LINKS.demo.fromLanding.max}
                target="_blank"
                className={styles.maxBtn}
                onClick={() => reachGoal("click_max_demo")}
              >
                {t("tryDemo.maxCta")}
              </Button>
            </div>

            <div className={styles.messengerCard}>
              <TelegramIcon size={40} />
              <span className={styles.messengerDesc}>
                {t("tryDemo.appDemo")}
              </span>
              <Button
                type="primary"
                size="large"
                href={LINKS.demo.fromLanding.telegram}
                target="_blank"
                className={styles.tgBtn}
                onClick={() => reachGoal("click_tg_bot")}
              >
                {t("tryDemo.tgCta")}
              </Button>
            </div>

            {/* Общий QR-код демо: с компьютера — навести телефон, с телефона — нажать */}
            <DemoQrBlock inSide scanning />
          </div>
        </motion.div>
        {/* Приглашение в CRM отсюда убрано (Руслан 06.10.2026): у секции
            «CRM собственной разработки» своя кнопка с тем же предложением */}
      </div>
    </section>
  );
}
