"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import {
  MegaphoneIcon,
  StoreIcon,
  PackageIcon,
  MessageIcon,
} from "@/components/ui/icons/icons";
import styles from "./guests-path-section.module.css";

const { Title, Text } = Typography;

type PathIcon = (props: {
  size?: number;
  className?: string;
}) => React.ReactElement;

/**
 * Путь гостя в приложение — ответ на первый вопрос ресторатора: «а откуда
 * возьмутся гости?».
 *
 * 🔴 Порядок каналов не декоративный: от самого частого к самому
 * недооценённому. Третий — QR на упаковке — единственный, который
 * возвращает гостя, пришедшего через агрегатор, и ради него блок и написан.
 *
 * 🔴 Блок отвечает УТВЕРДИТЕЛЬНО. Отрицания («мы не агрегатор», «мы не покупаем
 * трафик») объясняют то, о чём не спрашивали, и читаются как оправдание.
 *
 * Без плиток (Руслан 06.10.2026): четыре канала одним рядом через разделитель,
 * на телефоне — строками списка. Пояснение канала осталось мелко под
 * названием: других страниц с ним нет, а «гость из агрегатора возвращается
 * без комиссии» — главный довод блока.
 */
const CHANNELS: readonly { id: string; icon: PathIcon; accent: string }[] = [
  { id: "link", icon: MegaphoneIcon, accent: "#1677ff" },
  { id: "qrHall", icon: StoreIcon, accent: "#14c4a2" },
  { id: "qrPack", icon: PackageIcon, accent: "#f76707" },
  { id: "staff", icon: MessageIcon, accent: "#7048e8" },
] as const;

export function GuestsPathSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="guests-path" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text className={styles.label}>{t("guestsPath.label")}</Text>
          <Title level={2} className={styles.title}>
            {t("guestsPath.title")}
          </Title>
          <Text className={styles.subtitle}>{t("guestsPath.subtitle")}</Text>
        </motion.div>

        <ul className={styles.chain}>
          {CHANNELS.map((channel, index) => (
            <motion.li
              key={channel.id}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              className={styles.channel}
            >
              <span
                className={styles.channelIcon}
                aria-hidden="true"
                style={{
                  color: channel.accent,
                  background: `${channel.accent}18`,
                  border: `1px solid ${channel.accent}44`,
                }}
              >
                <channel.icon size={18} />
              </span>
              <span className={styles.channelBody}>
                <span className={styles.channelTitle}>
                  {t(`guestsPath.items.${channel.id}.title`)}
                </span>
                <span className={styles.channelText}>
                  {t(`guestsPath.items.${channel.id}.text`)}
                </span>
              </span>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={styles.outcome}
        >
          <Text className={styles.outcomeText}>{t("guestsPath.outcome")}</Text>
          {/* 🔴 Раздаточные материалы мы не готовим и не передаём — приписка
              стоит здесь, чтобы обещание не дочиталось из пунктов про QR */}
          <Text className={styles.note}>{t("guestsPath.note")}</Text>
        </motion.div>
      </div>
    </section>
  );
}
