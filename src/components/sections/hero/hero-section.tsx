"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
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
          {/* 🔴 Первый экран НЕ анимируется. Варианты framer-motion писали
              в разметку opacity: 0, и заголовок с кнопками проявлялись только
              после загрузки бандла: платный клик из РСЯ упирался в пустой
              экран, а LCP отсчитывался от конца анимации. Секции ниже сгиба
              анимацию сохранили — на LCP они не влияют. */}
          <div className={styles.textCol}>
            {/* Надзаголовочной пилюли нет: она повторяла «бот на всю сеть» из
                заголовка, а вместе с пилюлей триала зажимала блок в две рамки.
                «Для одной точки и для сети» не потеряно — оно открывает
                подзаголовок, чтобы одиночная точка не решила, что сервис не про неё */}
            <div>
              <Title level={1} className={styles.title}>
                <span dangerouslySetInnerHTML={{ __html: t("hero.title") }} />
              </Title>
            </div>

            {/* Первый экран несёт одну мысль. Перечень интеграций отсюда убран:
                ресторатору без кассы он читался как список требований к нему —
                интеграции живут в своей секции с пометкой «по желанию» */}
            <div>
              <Text className={styles.subtitle}>{t("hero.subtitle")}</Text>
            </div>

            <div>
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
            </div>

            <div>
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
            </div>
          </div>

          {/* Правая колонка — телефон */}
          <div className={styles.phoneCol}>
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
          </div>
        </Flex>
      </div>
    </section>
  );
}
