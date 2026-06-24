"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button, Col, Flex, Modal, Row, Tag, Typography } from "antd";
import { PhoneMockup } from "@/components/ui/phone-mockup/phone-mockup";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { theme } from "@/config/theme";
import styles from "./features-section.module.css";

const { Title, Text } = Typography;

type MockupType = "phone" | "banner";

type Benefit = {
  id: string;
  icon: string;
  accentColor: string;
  mockupType: MockupType;
  mockupImage: string;
  mockupVideo?: string;
  bannerRatio?: string;
  linkUrl?: string;
};

const BENEFITS: readonly Benefit[] = [
  {
    id: "channel",
    icon: "🌐",
    accentColor: "#15aabf",
    mockupType: "banner",
    mockupImage: "/images/sections/one-bot-network-section.png",
  },
  {
    id: "growth",
    icon: "🎯",
    accentColor: "#14c4a2",
    mockupType: "banner",
    mockupImage: "/images/sections/loyalty-regulars-section.png",
  },
  {
    id: "retention",
    icon: "💸",
    accentColor: theme.colors.success,
    mockupType: "banner",
    mockupImage: "/images/sections/repeat-orders-no-commission-section.png",
  },
  {
    id: "pos",
    icon: "🍳",
    accentColor: "#7048e8",
    mockupType: "banner",
    mockupImage: "/images/sections/POS.png",
    bannerRatio: "2 / 3",
  },
  {
    id: "constructor",
    icon: "🍔",
    accentColor: "#e64980",
    mockupType: "banner",
    mockupImage: "/images/sections/dish-constructor-section.png",
  },
  {
    id: "delivery",
    icon: "📦",
    accentColor: "#f76707",
    mockupType: "banner",
    mockupImage: "/images/sections/yandex-delivery-section.png",
  },
  {
    id: "team",
    icon: "👥",
    accentColor: "#12b886",
    mockupType: "banner",
    mockupImage: "/images/sections/team-app-section.png",
  },
  {
    id: "autopilot",
    icon: "⚙️",
    accentColor: "#1677ff",
    mockupType: "banner",
    mockupImage: "/images/sections/self-service-support-section.png",
  },
] as const;

type DetailsSection = { title: string; points: string[] };

function PhoneVideo({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!loadedRef.current) {
            video.src = src;
            loadedRef.current = true;
          }
          void video.play();
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px", threshold: 0.1 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted
      loop
      playsInline
      preload="none"
    />
  );
}

function BenefitMockup({ benefit }: { benefit: Benefit }) {
  const { t } = useTranslation("landing");
  const title = t(`benefits.items.${benefit.id}.title`);

  return (
    <Flex justify="center" className={styles.phoneContainer}>
      <div
        className={styles.phoneGlow}
        style={{
          background: `radial-gradient(circle, ${benefit.accentColor}22 0%, transparent 65%)`,
        }}
      />
      {benefit.mockupType === "banner" ? (
        <div
          className={styles.bannerCard}
          style={
            benefit.bannerRatio
              ? ({ "--banner-ratio": benefit.bannerRatio } as CSSProperties)
              : undefined
          }
        >
          <Image
            src={benefit.mockupImage}
            alt={title}
            fill
            sizes="360px"
            className={styles.bannerImage}
          />
        </div>
      ) : (
        <PhoneMockup>
          {benefit.mockupVideo ? (
            <PhoneVideo
              src={benefit.mockupVideo}
              className={styles.phoneScreenImage}
            />
          ) : (
            <Image
              src={benefit.mockupImage}
              alt={title}
              fill
              sizes="280px"
              className={styles.phoneScreenImage}
            />
          )}
        </PhoneMockup>
      )}
    </Flex>
  );
}

function BenefitBlock({
  benefit,
  reversed,
  onOpenDetails,
}: {
  benefit: Benefit;
  reversed: boolean;
  onOpenDetails: (benefit: Benefit) => void;
}) {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const base = `benefits.items.${benefit.id}`;

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
                  background: `${benefit.accentColor}18`,
                  border: `1px solid ${benefit.accentColor}44`,
                  color: benefit.accentColor,
                  borderRadius: "var(--radius-pill)",
                  padding: "4px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  width: "fit-content",
                }}
              >
                {benefit.icon} {t(`${base}.tag`)}
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
                {t(`${base}.title`)}
              </Title>

              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: 17,
                  lineHeight: 1.65,
                  display: "block",
                }}
              >
                {t(`${base}.result`)}
              </Text>

              <Button
                type="default"
                size="large"
                onClick={() => onOpenDetails(benefit)}
                className={styles.detailsBtn}
                style={{
                  width: "fit-content",
                  color: benefit.accentColor,
                  borderColor: `${benefit.accentColor}55`,
                  background: `${benefit.accentColor}12`,
                }}
              >
                {t("benefits.detailsCta")} →
              </Button>
            </Flex>
          </motion.div>
        </Col>

        {/* Mockup column */}
        <Col xs={24} md={12}>
          <motion.div
            initial={{ opacity: 0, x: reversed ? -40 : 40, scale: 0.94 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          >
            <BenefitMockup benefit={benefit} />
          </motion.div>
        </Col>
      </Row>
    </div>
  );
}

function BenefitDetailsModal({
  benefit,
  onClose,
}: {
  benefit: Benefit | null;
  onClose: () => void;
}) {
  const { t } = useTranslation("landing");

  if (!benefit) return null;

  const base = `benefits.items.${benefit.id}`;
  const intro = t(`${base}.details.intro`);
  const sections = t(`${base}.details.sections`, {
    returnObjects: true,
  }) as DetailsSection[];
  const linkLabel = benefit.linkUrl ? t(`${base}.linkLabel`) : "";

  return (
    <Modal
      open={!!benefit}
      onCancel={onClose}
      footer={null}
      width={560}
      title={
        <Flex align="center" gap={10} style={{ paddingRight: 32 }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>{benefit.icon}</span>
          <span
            style={{
              color: theme.colors.textPrimary,
              fontSize: 19,
              fontWeight: 800,
              lineHeight: 1.3,
            }}
          >
            {t(`${base}.title`)}
          </span>
        </Flex>
      }
    >
      <Flex vertical gap={24} className={styles.modalBody}>
        {intro && (
          <Text style={{ color: theme.colors.textSecondary, lineHeight: 1.6 }}>
            {intro}
          </Text>
        )}

        {Array.isArray(sections) &&
          sections.map((section, i) => (
            <Flex vertical gap={10} key={i}>
              <Text
                strong
                style={{ color: theme.colors.textPrimary, fontSize: 15 }}
              >
                {section.title}
              </Text>
              {section.points.map((point, j) => (
                <Flex key={j} align="flex-start" gap={10}>
                  <Text
                    style={{
                      color: benefit.accentColor,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    ✓
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {point}
                  </Text>
                </Flex>
              ))}
            </Flex>
          ))}

        {benefit.linkUrl && linkLabel && (
          <a
            href={benefit.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 8,
              backgroundColor: `${benefit.accentColor}14`,
              color: benefit.accentColor,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              width: "fit-content",
            }}
          >
            {linkLabel} →
          </a>
        )}
      </Flex>
    </Modal>
  );
}

export function FeaturesSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const [activeBenefit, setActiveBenefit] = useState<Benefit | null>(null);

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
          <Title
            level={2}
            style={{
              color: theme.colors.textPrimary,
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              margin: "0 0 24px",
            }}
          >
            {t("benefits.title")}
          </Title>
          <div className={styles.outcomeChips}>
            {(t("benefits.chips", { returnObjects: true }) as string[]).map(
              (chip) => (
                <span key={chip} className={styles.outcomeChip}>
                  {chip}
                </span>
              ),
            )}
          </div>
        </motion.div>

        {BENEFITS.map((benefit, i) => (
          <BenefitBlock
            key={benefit.id}
            benefit={benefit}
            reversed={i % 2 !== 0}
            onOpenDetails={setActiveBenefit}
          />
        ))}
      </div>

      <BenefitDetailsModal
        benefit={activeBenefit}
        onClose={() => setActiveBenefit(null)}
      />
    </section>
  );
}
