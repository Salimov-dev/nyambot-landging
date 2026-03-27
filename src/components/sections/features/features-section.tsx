"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Col, Flex, Row, Tag, Typography } from "antd";
import { PhoneMockup } from "@/components/ui/phone-mockup/phone-mockup";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { theme } from "@/config/theme";
import styles from "./features-section.module.css";

const { Title, Text } = Typography;

const FEATURES = [
  {
    id: "messengers",
    tagKey: "features.items.messengers.tag",
    titleKey: "features.items.messengers.title",
    descriptionKey: "features.items.messengers.description",
    pointsKey: "features.items.messengers.points",
    icon: "💬",
    accentColor: theme.colors.accent,
  },
  {
    id: "noCommission",
    tagKey: "features.items.noCommission.tag",
    titleKey: "features.items.noCommission.title",
    descriptionKey: "features.items.noCommission.description",
    pointsKey: "features.items.noCommission.points",
    icon: "💸",
    accentColor: theme.colors.success,
  },
  {
    id: "crm",
    tagKey: "features.items.crm.tag",
    titleKey: "features.items.crm.title",
    descriptionKey: "features.items.crm.description",
    pointsKey: "features.items.crm.points",
    icon: "📊",
    accentColor: "#1677ff",
  },
  {
    id: "crew",
    tagKey: "features.items.crew.tag",
    titleKey: "features.items.crew.title",
    descriptionKey: "features.items.crew.description",
    pointsKey: "features.items.crew.points",
    icon: "🛵",
    accentColor: "#b652ff",
  },
  {
    id: "marketing",
    tagKey: "features.items.marketing.tag",
    titleKey: "features.items.marketing.title",
    descriptionKey: "features.items.marketing.description",
    pointsKey: "features.items.marketing.points",
    icon: "🎯",
    accentColor: "#14c4a2",
  },
  {
    id: "languages",
    tagKey: "features.items.languages.tag",
    titleKey: "features.items.languages.title",
    descriptionKey: "features.items.languages.description",
    pointsKey: "features.items.languages.points",
    icon: "🌍",
    accentColor: "#f5a623",
  },
  {
    id: "selfService",
    tagKey: "features.items.selfService.tag",
    titleKey: "features.items.selfService.title",
    descriptionKey: "features.items.selfService.description",
    pointsKey: "features.items.selfService.points",
    icon: "🛠️",
    accentColor: "#52c41a",
  },
  {
    id: "ai",
    tagKey: "features.items.ai.tag",
    titleKey: "features.items.ai.title",
    descriptionKey: "features.items.ai.description",
    pointsKey: "features.items.ai.points",
    icon: "🤖",
    accentColor: "#722ed1",
  },
] as const;

function FeatureBlock({
  feature,
  reversed,
}: {
  feature: (typeof FEATURES)[number];
  reversed: boolean;
}) {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const points = t(feature.pointsKey, { returnObjects: true }) as string[];

  return (
    <div ref={ref} className={styles.featureBlock}>
      <Row
        gutter={[64, 48]}
        align="middle"
        style={{ flexDirection: reversed ? "row-reverse" : "row" }}
      >
        {/* Text column */}
        <Col xs={24} md={12}>
          <motion.div
            initial={{ opacity: 0, x: reversed ? 40 : -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <Flex vertical gap={20}>
              <Tag
                style={{
                  background: `${feature.accentColor}18`,
                  border: `1px solid ${feature.accentColor}44`,
                  color: feature.accentColor,
                  borderRadius: "var(--radius-pill)",
                  padding: "4px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  width: "fit-content",
                }}
              >
                {feature.icon} {t(feature.tagKey)}
              </Tag>

              <Title
                level={2}
                style={{
                  color: theme.colors.textPrimary,
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                {t(feature.titleKey)}
              </Title>

              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: 16,
                  lineHeight: 1.65,
                  display: "block",
                }}
              >
                {t(feature.descriptionKey)}
              </Text>

              {Array.isArray(points) && points.length > 0 && (
                <Flex vertical gap={10}>
                  {points.map((point, i) => (
                    <Flex key={i} align="flex-start" gap={10}>
                      <Text
                        style={{
                          color: feature.accentColor,
                          fontSize: 16,
                          lineHeight: 1.5,
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        ✓
                      </Text>
                      <Text style={{ color: theme.colors.textSecondary, fontSize: 15, lineHeight: 1.5 }}>
                        {point}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              )}
            </Flex>
          </motion.div>
        </Col>

        {/* Phone column */}
        <Col xs={24} md={12}>
          <motion.div
            initial={{ opacity: 0, x: reversed ? -40 : 40, scale: 0.94 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          >
            <Flex justify="center" className={styles.phoneContainer}>
              <div
                className={styles.phoneGlow}
                style={{ background: `radial-gradient(circle, ${feature.accentColor}22 0%, transparent 65%)` }}
              />
              <PhoneMockup>
                <div className={styles.phoneScreen} />
              </PhoneMockup>
            </Flex>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
}

export function FeaturesSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="features" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text style={{ color: theme.colors.accent, fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {t("features.label")}
          </Text>
          <Title
            level={2}
            style={{ color: theme.colors.textPrimary, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, margin: "12px 0 0" }}
          >
            {t("features.title")}
          </Title>
        </motion.div>

        {FEATURES.map((feature, i) => (
          <FeatureBlock key={feature.id} feature={feature} reversed={i % 2 !== 0} />
        ))}
      </div>
    </section>
  );
}
