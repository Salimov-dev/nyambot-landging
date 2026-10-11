"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { useHasTranslation } from "@/hooks/use-has-translation.hook";
import { theme } from "@/config/theme";
import { LINKS } from "@/config/links.config";
import styles from "./loyalty-section.module.css";

const { Title, Text } = Typography;

/** Секция переведена на все языки (11.10.2026); язык без своего заголовка
 *  её не покажет — по-русски она на чужой странице не вылезет */
const SECTION_KEY = "loyaltyBlock.title";

const LOYALTY_CARD = {
  NYAMBOT: "nyambot",
  IIKO_CARD: "iikoCard",
  RK_FRIENDS: "rkFriends",
} as const;

type ILoyaltyCard = (typeof LOYALTY_CARD)[keyof typeof LOYALTY_CARD];

type ILoyaltyCardView = {
  id: ILoyaltyCard;
  /** Квадратный знак слева от названия; без знака — только название */
  mark?: { src: string; size: number; className?: string };
  /** Фон и цвет названия — по фирменным цветам программы */
  toneClass: string;
  isNew?: boolean;
};

/** Карточка — знак программы и её название рядом, как у вендоров: у iikoCard
 *  и r_k Friends своего логотипа-карточки нет (Руслан 11.10.2026). Название —
 *  текстом, а не картинкой: чёткое на любом экране и правится в локали.
 *  У iikoCard знака нет — знак iiko рядом с «iikoCard» повторял название. */
const CARDS: ILoyaltyCardView[] = [
  {
    id: LOYALTY_CARD.NYAMBOT,
    mark: { src: "/images/loyalty/nyambot-mark.png", size: 256 },
    toneClass: styles.toneNyambot,
  },
  {
    id: LOYALTY_CARD.IIKO_CARD,
    toneClass: styles.toneIiko,
  },
  {
    id: LOYALTY_CARD.RK_FRIENDS,
    // Знак Friends — сплошной тёмный квадрат, а маскот Нямбота сливается
    // с фоном: в одном размере Friends выглядел крупнее (просмотр 11.10)
    mark: {
      src: "/images/loyalty/rk-friends-mark.png",
      size: 200,
      className: styles.markCompact,
    },
    toneClass: styles.toneFriends,
    isNew: true,
  },
];

export function LoyaltySection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const hasSection = useHasTranslation(SECTION_KEY);
  // На самой странице лояльности ссылка «Подробнее» вела бы на неё же
  const isLoyaltyPage = usePathname() === LINKS.pages.loyalty;

  if (!hasSection) return null;

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
            {t("loyaltyBlock.label")}
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
            {t(SECTION_KEY)}
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
            {t("loyaltyBlock.subtitle")}
          </Text>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={styles.cards}
        >
          {CARDS.map((card) => (
            <li key={card.id} className={styles.item}>
              <div className={`${styles.card} ${card.toneClass}`}>
                {card.mark && (
                  <Image
                    src={card.mark.src}
                    alt=""
                    width={card.mark.size}
                    height={card.mark.size}
                    sizes="120px"
                    className={`${styles.mark} ${card.mark.className ?? ""}`}
                  />
                )}
                <span className={styles.name}>
                  {t(`loyaltyBlock.items.${card.id}.name`)}
                </span>
              </div>
              {card.isNew && (
                <span className={styles.badge}>
                  {t("loyaltyBlock.badgeNew")}
                </span>
              )}
              <span className={styles.note}>
                {t(`loyaltyBlock.items.${card.id}.note`)}
              </span>
            </li>
          ))}
        </motion.ul>

        {!isLoyaltyPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={styles.moreRow}
          >
            <Link href={LINKS.pages.loyalty} className={styles.moreLink}>
              {t("loyaltyBlock.more")}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
