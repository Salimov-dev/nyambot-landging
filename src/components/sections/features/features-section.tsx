"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Image from "next/image";
import { Col, Flex, Row, Tag, Typography } from "antd";
import { PhoneMockup } from "@/components/ui/phone-mockup/phone-mockup";
import { NotebookMockup } from "@/components/ui/notebook-mockup/notebook-mockup";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { theme } from "@/config/theme";
import { LINKS } from "@/config/links.config";
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
    mockupType: "phone" as "phone" | "notebook",
    mockupImage: "/images/sections/first_service.png",
    mockupVideo: "/videos/phone/feature-messengers.mp4",
  },
  {
    id: "modernUI",
    tagKey: "features.items.modernUI.tag",
    titleKey: "features.items.modernUI.title",
    descriptionKey: "features.items.modernUI.description",
    pointsKey: "features.items.modernUI.points",
    icon: "✨",
    accentColor: "#eb2f96",
    mockupType: "phone" as "phone" | "notebook",
    mockupImage: "/images/sections/design.png",
    mockupVideo: "/videos/phone/feature-miniapp.mp4",
    mockupVideoWide: true,
  },
  {
    id: "noCommission",
    tagKey: "features.items.noCommission.tag",
    titleKey: "features.items.noCommission.title",
    descriptionKey: "features.items.noCommission.description",
    pointsKey: "features.items.noCommission.points",
    icon: "💸",
    accentColor: theme.colors.success,
    mockupType: "phone" as "phone" | "notebook",
    mockupImage: "/images/sections/stop_pay.png",
    mockupVideo: "/videos/phone/feature-no-commission.mp4",
  },
  {
    id: "crm",
    tagKey: "features.items.crm.tag",
    titleKey: "features.items.crm.title",
    descriptionKey: "features.items.crm.description",
    pointsKey: "features.items.crm.points",
    icon: "📊",
    accentColor: "#1677ff",
    mockupType: "notebook" as "phone" | "notebook",
    mockupImage: "/images/sections/monitoring.png",
  },
  {
    id: "menuCustomization",
    tagKey: "features.items.menuCustomization.tag",
    titleKey: "features.items.menuCustomization.title",
    descriptionKey: "features.items.menuCustomization.description",
    pointsKey: "features.items.menuCustomization.points",
    icon: "🍕",
    accentColor: "#fa8c16",
    mockupType: "phone" as "phone" | "notebook",
    mockupImage: "/images/sections/sostav-modifiers.png",
    mockupVideo: "/videos/phone/feature-menu-customization.mp4",
  },
  {
    id: "comboBuilder",
    tagKey: "features.items.comboBuilder.tag",
    titleKey: "features.items.comboBuilder.title",
    descriptionKey: "features.items.comboBuilder.description",
    pointsKey: "features.items.comboBuilder.points",
    icon: "🍱",
    accentColor: "#36cfc9",
    mockupType: "phone" as "phone" | "notebook",
    mockupImage: "/images/sections/combo.png",
    mockupVideo: "/videos/phone/feature-combo.mp4",
  },
  {
    id: "crewAdmin",
    tagKey: "features.items.crewAdmin.tag",
    titleKey: "features.items.crewAdmin.title",
    descriptionKey: "features.items.crewAdmin.description",
    pointsKey: "features.items.crewAdmin.points",
    icon: "👨‍💼",
    accentColor: "#9254de",
    mockupType: "phone" as "phone" | "notebook",
    mockupImage: "/images/sections/crew_admin.png",
    mockupVideo: "/videos/phone/feature-crew-admin.mp4",
    mockupVideoContain: true,
  },
  {
    id: "crew",
    tagKey: "features.items.crew.tag",
    titleKey: "features.items.crew.title",
    descriptionKey: "features.items.crew.description",
    pointsKey: "features.items.crew.points",
    icon: "🛵",
    accentColor: "#b652ff",
    mockupType: "phone" as "phone" | "notebook",
    mockupImage: "/images/sections/crew_courier.png",
    mockupVideo: "/videos/phone/feature-crew-delivery.mp4",
    mockupVideoContain: true,
  },
  {
    id: "payment",
    tagKey: "features.items.payment.tag",
    titleKey: "features.items.payment.title",
    descriptionKey: "features.items.payment.description",
    pointsKey: "features.items.payment.points",
    icon: "💳",
    accentColor: "#1677ff",
    mockupType: "phone" as "phone" | "notebook",
    mockupImage: "/images/sections/payments.png",
    mockupVideo: "/videos/phone/feature-payment.mp4",
    mockupVideoZoom: true,
  },
  {
    id: "marketing",
    tagKey: "features.items.marketing.tag",
    titleKey: "features.items.marketing.title",
    descriptionKey: "features.items.marketing.description",
    pointsKey: "features.items.marketing.points",
    linkUrl: `${LINKS.docs}/promotions-examples`,
    linkLabelKey: "features.items.marketing.linkLabel",
    icon: "🎯",
    accentColor: "#14c4a2",
    mockupType: "phone" as "phone" | "notebook",
    mockupImage: "/images/sections/discount.png",
    mockupVideo: "/videos/phone/feature-marketing.mp4",
  },
  {
    id: "scheduledSending",
    tagKey: "features.items.scheduledSending.tag",
    titleKey: "features.items.scheduledSending.title",
    descriptionKey: "features.items.scheduledSending.description",
    pointsKey: "features.items.scheduledSending.points",
    icon: "📅",
    accentColor: "#fa541c",
    mockupType: "phone" as "phone" | "notebook",
    mockupImage: "/images/sections/day_offer.png",
    mockupVideo: "/videos/phone/feature-scheduled-send.mp4",
  },
  {
    id: "languages",
    tagKey: "features.items.languages.tag",
    titleKey: "features.items.languages.title",
    descriptionKey: "features.items.languages.description",
    pointsKey: "features.items.languages.points",
    icon: "🌍",
    accentColor: "#f5a623",
    mockupType: "phone" as "phone" | "notebook",
    mockupImage: "/images/sections/multi_language.png",
    mockupVideo: "/videos/phone/feature-languages.mp4",
  },
  {
    id: "selfService",
    tagKey: "features.items.selfService.tag",
    titleKey: "features.items.selfService.title",
    descriptionKey: "features.items.selfService.description",
    pointsKey: "features.items.selfService.points",
    icon: "🛠️",
    accentColor: "#52c41a",
    mockupType: "notebook" as "phone" | "notebook",
    mockupImage: "/images/sections/samostoyatelno_crm.png",
  },
  {
    id: "aiCrm",
    tagKey: "features.items.aiCrm.tag",
    titleKey: "features.items.aiCrm.title",
    descriptionKey: "features.items.aiCrm.description",
    pointsKey: "features.items.aiCrm.points",
    icon: "🤖",
    accentColor: "#722ed1",
    mockupType: "notebook" as "phone" | "notebook",
    mockupImage: "/images/sections/AI_assistant_crm.png",
  },
  {
    id: "aiSearch",
    tagKey: "features.items.aiSearch.tag",
    titleKey: "features.items.aiSearch.title",
    descriptionKey: "features.items.aiSearch.description",
    pointsKey: "features.items.aiSearch.points",
    icon: "🔍",
    accentColor: "#13c2c2",
    mockupType: "phone" as "phone" | "notebook",
    mockupImage: "/images/sections/AI_search.png",
    mockupVideo: "/videos/phone/feature-ai-search.mp4",
  },
] as const;

function PhoneVideo({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
    <video
      ref={videoRef}
      src={src}
      className={className}
      muted
      loop
      playsInline
    />
  );
}

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
  const isNotebook = feature.mockupType === "notebook";
  const textSpan = isNotebook ? 10 : 12;
  const mockupSpan = isNotebook ? 14 : 12;

  return (
    <div ref={ref} className={styles.featureBlock}>
      <Row
        gutter={[64, 48]}
        align="middle"
        style={{ flexDirection: reversed ? "row-reverse" : "row" }}
      >
        {/* Text column */}
        <Col xs={24} md={textSpan}>
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
                      <Text
                        style={{
                          color: theme.colors.textSecondary,
                          fontSize: 15,
                          lineHeight: 1.5,
                        }}
                      >
                        {point}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              )}

              {"linkUrl" in feature &&
                "linkLabelKey" in feature &&
                feature.linkUrl &&
                feature.linkLabelKey && (
                  <a
                    href={feature.linkUrl as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 4,
                      padding: "8px 16px",
                      borderRadius: 8,
                      backgroundColor: `${feature.accentColor}14`,
                      color: feature.accentColor,
                      fontSize: 14,
                      fontWeight: 500,
                      textDecoration: "none",
                      transition: "background-color 0.2s",
                      width: "fit-content",
                    }}
                  >
                    {t(feature.linkLabelKey as string)} →
                  </a>
                )}
            </Flex>
          </motion.div>
        </Col>

        {/* Mockup column */}
        <Col xs={24} md={mockupSpan}>
          <motion.div
            initial={{ opacity: 0, x: reversed ? -40 : 40, scale: 0.94 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          >
            <Flex justify="center" className={styles.phoneContainer}>
              <div
                className={styles.phoneGlow}
                style={{
                  background: `radial-gradient(circle, ${feature.accentColor}22 0%, transparent 65%)`,
                }}
              />
              {isNotebook ? (
                <NotebookMockup>
                  {"mockupImage" in feature && feature.mockupImage ? (
                    <Image
                      src={feature.mockupImage}
                      alt={t(feature.titleKey)}
                      fill
                      sizes="640px"
                      className={styles.phoneScreenImage}
                    />
                  ) : (
                    <div className={styles.phoneScreen} />
                  )}
                </NotebookMockup>
              ) : (
                <PhoneMockup>
                  {"mockupVideo" in feature && feature.mockupVideo ? (
                    <PhoneVideo
                      src={feature.mockupVideo}
                      className={`${styles.phoneScreenImage}${"mockupVideoWide" in feature && feature.mockupVideoWide ? ` ${styles.phoneScreenImageWide}` : ""}${"mockupVideoContain" in feature && feature.mockupVideoContain ? ` ${styles.phoneScreenImageContain}` : ""}${"mockupVideoCenter" in feature && feature.mockupVideoCenter ? ` ${styles.phoneScreenImageCenter}` : ""}${"mockupVideoZoom" in feature && feature.mockupVideoZoom ? ` ${styles.phoneScreenImageZoom}` : ""}`}
                    />
                  ) : "mockupImage" in feature && feature.mockupImage ? (
                    <Image
                      src={feature.mockupImage}
                      alt={t(feature.titleKey)}
                      fill
                      sizes="280px"
                      className={styles.phoneScreenImage}
                    />
                  ) : (
                    <div className={styles.phoneScreen} />
                  )}
                </PhoneMockup>
              )}
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
          <Text
            style={{
              color: theme.colors.accent,
              fontSize: 14,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {t("features.label")}
          </Text>
          <Title
            level={2}
            style={{
              color: theme.colors.textPrimary,
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              margin: "12px 0 0",
            }}
          >
            {t("features.title")}
          </Title>
        </motion.div>

        {FEATURES.map((feature, i) => (
          <FeatureBlock
            key={feature.id}
            feature={feature}
            reversed={i % 2 !== 0}
          />
        ))}
      </div>
    </section>
  );
}
