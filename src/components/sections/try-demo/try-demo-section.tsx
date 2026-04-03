"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button, Col, Flex, Row, Tag, Typography } from "antd";
import { PhoneMockup } from "@/components/ui/phone-mockup/phone-mockup";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { TelegramIcon } from "@/components/ui/messenger-icons/telegram-icon";
import { MaxIcon } from "@/components/ui/messenger-icons/max-icon";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import { theme } from "@/config/theme";
import styles from "./try-demo-section.module.css";

const { Title, Text } = Typography;

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
            👆 {t("tryDemo.tag")}
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
        </motion.div>

        <Row gutter={[32, 32]} justify="center" style={{ marginTop: 56 }}>
          {/* MAX demo */}
          <Col xs={24} sm={20} md={10}>
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
            >
              <Flex
                vertical
                align="center"
                gap={24}
                className={styles.demoCard}
              >
                <Flex vertical align="center" gap={8}>
                  <MaxIcon size={48} />
                  <Text
                    style={{
                      color: theme.colors.textPrimary,
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    MAX
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    {t("tryDemo.maxDesc")}
                  </Text>
                </Flex>

                <div className={styles.phoneWrap}>
                  <div
                    className={styles.phoneGlow}
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255,140,0,0.2) 0%, transparent 65%)",
                    }}
                  />
                  <PhoneMockup>
                    <Image
                      src="/images/sections/demo_max.png"
                      alt="MAX демо"
                      fill
                      sizes="280px"
                      className={styles.phoneScreenImage}
                    />
                  </PhoneMockup>
                </div>

                <Button
                  type="primary"
                  size="large"
                  href={LINKS.demo.max}
                  target="_blank"
                  className={styles.maxBtn}
                  block
                  onClick={() => reachGoal("click_max_demo")}
                >
                  {t("tryDemo.maxCta")}
                </Button>
              </Flex>
            </motion.div>
          </Col>

          {/* Telegram demo */}
          <Col xs={24} sm={20} md={10}>
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.2 }}
            >
              <Flex
                vertical
                align="center"
                gap={24}
                className={styles.demoCard}
              >
                <Flex vertical align="center" gap={8}>
                  <TelegramIcon size={48} />
                  <Text
                    style={{
                      color: theme.colors.textPrimary,
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    Telegram
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    {t("tryDemo.tgDesc")}
                  </Text>
                </Flex>

                <div className={styles.phoneWrap}>
                  <div
                    className={styles.phoneGlow}
                    style={{
                      background:
                        "radial-gradient(circle, rgba(39,161,232,0.2) 0%, transparent 65%)",
                    }}
                  />
                  <PhoneMockup>
                    <Image
                      src="/images/sections/demo_tg.png"
                      alt="Telegram демо"
                      fill
                      sizes="280px"
                      className={styles.phoneScreenImage}
                    />
                  </PhoneMockup>
                </div>

                <Button
                  type="primary"
                  size="large"
                  href={LINKS.demo.telegram}
                  target="_blank"
                  className={styles.tgBtn}
                  block
                  onClick={() => reachGoal("click_tg_bot")}
                >
                  {t("tryDemo.tgCta")}
                </Button>
              </Flex>
            </motion.div>
          </Col>
        </Row>

        {/* CRM CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <Flex vertical align="center" gap={12} className={styles.crmCta}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 15 }}>
              {t("tryDemo.crmHint")}
            </Text>
            <Button
              size="large"
              href={LINKS.crm}
              target="_blank"
              className={styles.crmBtn}
              onClick={() => reachGoal("click_trial")}
            >
              {t("tryDemo.crmCta")}
            </Button>
            <Text style={{ color: theme.colors.textTertiary, fontSize: 13 }}>
              {t("tryDemo.crmTrial")}
            </Text>
          </Flex>
        </motion.div>
      </div>
    </section>
  );
}
