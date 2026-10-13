"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { useHasTranslation } from "@/hooks/use-has-translation.hook";
import { PhoneMockup } from "@/components/ui/phone-mockup/phone-mockup";
import { CheckIcon, PlayPauseIcon } from "@/components/ui/icons/icons";
import {
  playVideoFrom,
  useVideoSteps,
} from "@/components/ui/step-video/use-video-steps.hook";
import { MaxIcon } from "@/components/ui/messenger-icons/max-icon";
import { TelegramIcon } from "@/components/ui/messenger-icons/telegram-icon";
import { DEMO_QR_IMAGE } from "@/components/sections/try-demo/demo-qr-block";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import {
  VITRINA_CHAPTERS,
  VITRINA_VIDEO,
  type VitrinaChapter,
} from "./vitrina-video.config";
import styles from "./vitrina-section.module.css";

const { Title, Text } = Typography;

/** Главы слева от телефона, остальные — справа (Руслан 13.10.2026: список
 *  справа оставлял пустоту и тянулся вниз) */
const LEFT_COUNT = 5;

/** QR-код демо в полосе «Попробуй сам» — компактный, рядом с текстом */
const DEMO_QR_SIZE = 132;

interface ChapterListProps {
  chapters: readonly VitrinaChapter[];
  /** Номер первой главы списка минус один */
  offset: number;
  active: VitrinaChapter;
  onPick: (chapter: VitrinaChapter) => void;
  className: string;
  isInView: boolean;
  delay: number;
}

function ChapterList({
  chapters,
  offset,
  active,
  onPick,
  className,
  isInView,
  delay,
}: ChapterListProps) {
  const { t } = useTranslation("landing");
  return (
    <motion.ol
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={`${styles.chapters} ${className}`}
      start={offset + 1}
    >
      {chapters.map((chapter, index) => (
        <li key={chapter}>
          <button
            type="button"
            className={`${styles.chapter} ${chapter === active ? styles.chapterActive : ""}`}
            aria-current={chapter === active ? "step" : undefined}
            onClick={() => onPick(chapter)}
          >
            <span className={styles.num}>{offset + index + 1}</span>
            <span className={styles.chapterBody}>
              <span className={styles.chapterTitle}>
                {t(`vitrina.chapters.${chapter}.title`)}
              </span>
              <span className={styles.chapterText}>
                {t(`vitrina.chapters.${chapter}.text`)}
              </span>
            </span>
          </button>
        </li>
      ))}
    </motion.ol>
  );
}

/**
 * «Витрина» — третий экран (Руслан 13.10.2026): главное, что покупает
 * ресторатор, — само мини-приложение гостя в MAX и Телеграм. Ролик проходит
 * заказ целиком, глава ролика подсвечена, нажатие — переход к ней. Телефон по
 * центру, главы — по обе стороны на его высоту.
 * Раскадровка — docs-nyambot/marketing/landing/vitrina-na-lendinge-2026-10-13.
 */
export function VitrinaSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const hasText = useHasTranslation("vitrina.title");
  const videoRef = useRef<HTMLVideoElement>(null);
  const { step, held, toggle } = useVideoSteps(videoRef, VITRINA_VIDEO.steps);

  if (!hasText) return null;

  const active = VITRINA_CHAPTERS[step];
  const pick = (chapter: VitrinaChapter) =>
    playVideoFrom(videoRef.current, VITRINA_VIDEO.from[chapter]);

  return (
    <section id="vitrina" className={styles.section}>
      <div className={styles.glow} />
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text className={styles.label}>{t("vitrina.label")}</Text>
          <Title level={2} className={styles.title}>
            {t("vitrina.title")}
          </Title>
          <Text className={styles.subtitle}>{t("vitrina.subtitle")}</Text>
        </motion.div>

        <div className={styles.layout}>
          <ChapterList
            chapters={VITRINA_CHAPTERS.slice(0, LEFT_COUNT)}
            offset={0}
            active={active}
            onPick={pick}
            className={styles.left}
            isInView={isInView}
            delay={0.16}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={styles.phoneCol}
          >
            <div className={styles.phoneWrap}>
              <PhoneMockup className={styles.phone}>
                <video
                  ref={videoRef}
                  className={styles.video}
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={VITRINA_VIDEO.poster}
                  onClick={toggle}
                >
                  <source src={VITRINA_VIDEO.src} type="video/mp4" />
                </video>
              </PhoneMockup>
              <button
                type="button"
                className={`${styles.hold} ${held ? styles.holdOn : ""}`}
                aria-label={t(held ? "media.resume" : "media.pause")}
                aria-pressed={held}
                onClick={toggle}
              >
                <PlayPauseIcon paused={held} />
              </button>
            </div>
            {/* На телефоне главы ниже ролика — подпись текущей прямо под ним */}
            <p key={active} className={styles.caption}>
              <span className={styles.captionTitle}>
                {t(`vitrina.chapters.${active}.title`)}
              </span>
              {t(`vitrina.chapters.${active}.text`)}
            </p>
          </motion.div>

          <ChapterList
            chapters={VITRINA_CHAPTERS.slice(LEFT_COUNT)}
            offset={LEFT_COUNT}
            active={active}
            onPick={pick}
            className={styles.right}
            isInView={isInView}
            delay={0.2}
          />
        </div>

        {/* «Попробуй сам» — прямо под роликом (Руслан 13.10.2026): досмотрел,
            захотел — открыл у себя. Отдельная секция демо с главной снята:
            второй телефон с роликом подряд читался повтором. Якорь #try-demo —
            на него ведёт кнопка демо в Hero */}
        <motion.div
          id="try-demo"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.22 }}
          className={styles.demo}
        >
          {/* Общий QR-код демо — та же страница выбора, что у гостей заведения */}
          <a
            href={LINKS.demo.chooser}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.demoQr}
            aria-label={t("tryDemo.qrOpen")}
            onClick={() => reachGoal("open_demo_chooser")}
          >
            <Image
              src={DEMO_QR_IMAGE}
              alt={t("tryDemo.qrTitle")}
              width={DEMO_QR_SIZE}
              height={DEMO_QR_SIZE}
              unoptimized
            />
          </a>
          <div className={styles.demoMain}>
            <Title level={3} className={styles.demoTitle}>
              {t("tryDemo.title")}
            </Title>
            <Text className={styles.demoText}>{t("vitrina.demoQr")}</Text>
            <span className={styles.noAuth}>
              <CheckIcon size={14} />
              {t("tryDemo.noAuth")}
            </span>
          </div>
          <div className={styles.demoButtons}>
            <Button
              type="primary"
              size="large"
              href={LINKS.demo.fromLanding.max}
              target="_blank"
              icon={<MaxIcon size={22} />}
              className={styles.maxBtn}
              onClick={() => reachGoal("click_max_demo")}
            >
              {t("tryDemo.maxCta")}
            </Button>
            <Button
              type="primary"
              size="large"
              href={LINKS.demo.fromLanding.telegram}
              target="_blank"
              icon={<TelegramIcon size={22} />}
              className={styles.tgBtn}
              onClick={() => reachGoal("click_tg_bot")}
            >
              {t("tryDemo.tgCta")}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
