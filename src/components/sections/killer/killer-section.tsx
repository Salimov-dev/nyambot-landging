"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { useHasTranslation } from "@/hooks/use-has-translation.hook";
import {
  GlobeIcon,
  CartIcon,
  ChefHatIcon,
  CheckIcon,
  GiftIcon,
  LockIcon,
  QrCodeIcon,
} from "@/components/ui/icons/icons";
import {
  CartScene,
  LoyaltyScene,
  MoneyScene,
  NetworkScene,
  PosScene,
  QrScene,
} from "./killer-scenes";
import styles from "./killer-section.module.css";

const { Title, Text } = Typography;

type KillerIcon = (props: {
  size?: number;
  className?: string;
}) => React.ReactElement;

type KillerItem = {
  id: string;
  icon: KillerIcon;
  scene: () => React.ReactElement;
  accentColor: string;
};

/**
 * Шесть отличий — шесть остановок одного заказа (Руслан 06.10.2026): гость
 * отсканировал код → выбрал точку → собрал корзину без регистрации → получил
 * скидку и баллы → оплатил на счёт заведения → заказ ушёл в кассу. Поэтому
 * порядок — порядок пути, а не важности: «один бот на всю сеть» стал второй
 * остановкой, главной мыслью он остаётся в «Сравнении» ниже.
 *
 * Подсветка идёт по карточкам сама, в карточке оживает картинка. Все тексты
 * видны сразу (и для поисковика): анимацию ждать не нужно. На телефоне —
 * вертикальный путь: заголовки на линии, раскрыта текущая остановка.
 */
const ITEMS: readonly KillerItem[] = [
  { id: "qr", icon: QrCodeIcon, scene: QrScene, accentColor: "#e8590c" },
  {
    id: "network",
    icon: GlobeIcon,
    scene: NetworkScene,
    accentColor: "#15aabf",
  },
  { id: "guest", icon: CartIcon, scene: CartScene, accentColor: "#14c4a2" },
  {
    id: "loyalty",
    icon: GiftIcon,
    scene: LoyaltyScene,
    accentColor: "#c2255c",
  },
  { id: "money", icon: LockIcon, scene: MoneyScene, accentColor: "#2f9e44" },
  { id: "pos", icon: ChefHatIcon, scene: PosScene, accentColor: "#7048e8" },
] as const;

const canHover = () => window.matchMedia("(hover: hover)").matches;

/** pricingHref — на подстраницах тарифов нет, кнопка ведёт на «/#pricing» */
export function KillerSection({
  pricingHref = "#pricing",
}: {
  pricingHref?: string;
}) {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const hasCategory = useHasTranslation("killer.category");
  const [active, setActive] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  // Пауза: касание карточки (дочитать) и указатель над сеткой на компьютере
  const [held, setHeld] = useState(false);
  const [hovering, setHovering] = useState(false);
  const pathRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      {
        threshold: 0.25,
      },
    );
    observer.observe(path);
    return () => observer.disconnect();
  }, []);

  const next = () => setActive((index) => (index + 1) % ITEMS.length);
  // Касание чужой карточки — открыть её и остановиться; своей — пауза/дальше
  const onCardClick = (index: number) => {
    if (index === active) {
      setHeld((value) => !value);
      return;
    }
    setActive(index);
    setHeld(true);
  };
  const onCardEnter = (index: number) => {
    if (canHover()) setActive(index);
  };
  // За экраном стоит всё; пауза касанием и наведением держит только смену
  // остановки — картинка выбранной карточки должна доиграть
  const stopped = !onScreen;
  const timerHeld = held || hovering;

  return (
    <section id="killer" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text className={styles.label}>{t("killer.label")}</Text>
          <Title level={2} className={styles.title}>
            {t("killer.title")}
          </Title>
          <Text className={styles.subtitle}>{t("killer.subtitle")}</Text>
          {/* Строка категории — до карточек: сначала человек понимает, ЧТО это
              вообще, и только потом читает отличия */}
          {hasCategory ? (
            <p className={styles.category}>{t("killer.category")}</p>
          ) : null}
        </motion.div>

        <div
          ref={pathRef}
          className={`${styles.path} ${stopped ? styles.paused : ""}`}
        >
          {/* Линия пути над сеткой (компьютер): заполняется вместе с подсветкой */}
          <div className={styles.progress} aria-hidden="true">
            <span
              className={styles.progressFill}
              style={{ width: `${(active / (ITEMS.length - 1)) * 100}%` }}
            />
            {ITEMS.map((item, index) => (
              <span
                key={item.id}
                className={`${styles.progressDot} ${index <= active ? styles.progressDotOn : ""}`}
                style={{ left: `${(index / (ITEMS.length - 1)) * 100}%` }}
              />
            ))}
          </div>

          <ol
            className={styles.grid}
            onMouseEnter={() => canHover() && setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {ITEMS.map((item, index) => {
              const isActive = index === active;
              const Scene = item.scene;
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                  className={`${styles.card} landing-glass-card ${isActive ? styles.cardActive : ""} ${
                    index < active ? styles.cardPassed : ""
                  }`}
                  style={{ "--item": item.accentColor } as CSSProperties}
                  onMouseEnter={() => onCardEnter(index)}
                  onClick={() => onCardClick(index)}
                >
                  {/* Значок-остановка на линии — только на телефоне */}
                  <span className={styles.node} aria-hidden="true">
                    <item.icon size={20} />
                  </span>
                  <div className={styles.body}>
                    <div
                      key={isActive ? `play-${active}` : "rest"}
                      className={`${styles.illo} ${isActive ? styles.play : ""}`}
                    >
                      <Scene />
                    </div>
                    <Title level={3} className={styles.cardTitle}>
                      {t(`killer.items.${item.id}.title`)}
                    </Title>
                    <Text className={styles.cardText}>
                      {t(`killer.items.${item.id}.text`)}
                    </Text>
                  </div>
                  <span className={styles.accentBar} />
                </motion.li>
              );
            })}
          </ol>

          {/* Невидимый таймер остановки: его animationend — «дальше». Пауза
              и «уменьшить движение» останавливают его без JS-таймеров */}
          <span
            key={active}
            className={`${styles.timer} ${timerHeld ? styles.timerHeld : ""}`}
            onAnimationEnd={next}
          />
        </div>

        <p className={styles.nothing}>
          <span className={styles.nothingLabel}>{t("killer.notPrefix")}:</span>{" "}
          {t("killer.notNeeded")}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.pricingRow}
        >
          <span className={styles.pricingNote}>
            <CheckIcon size={16} />
            {t("killer.pricingNote")}
          </span>
          <Button
            type="default"
            size="large"
            href={pricingHref}
            className={styles.pricingBtn}
          >
            {t("killer.pricingCta")} →
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
