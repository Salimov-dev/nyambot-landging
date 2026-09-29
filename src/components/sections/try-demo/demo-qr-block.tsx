"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { QrCodeIcon } from "@/components/ui/icons/icons";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import styles from "./try-demo-section.module.css";

/** Картинка — готовый SVG на `nyambot.ru/demo`: код не меняется, рисовать
 *  его в браузере незачем, а оптимизатору Next в векторе сжимать нечего. */
const DEMO_QR_IMAGE = "/images/qr/demo-qr.svg";
const DEMO_QR_SIZE = 168;

/**
 * Общий QR-код демо-бота — та же страница выбора «MAX или Телеграм», что
 * получает гость заведения. С компьютера его сканируют телефоном, с телефона
 * жмут кнопку под ним.
 */
export function DemoQrBlock({
  showMore = true,
  inPage = false,
}: {
  /** Ссылка на страницу про общий QR-код — не нужна на самой этой странице. */
  showMore?: boolean;
  /** Внутри посадочной: во всю ширину контента и с отступом до карточек, а
   *  не узкой плашкой по центру секции демо. */
  inPage?: boolean;
}) {
  const { t } = useTranslation("landing");

  return (
    <div
      className={
        inPage ? `${styles.qrBlock} ${styles.qrBlockInPage}` : styles.qrBlock
      }
    >
      <a
        href={LINKS.demo.chooser}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.qrImageWrap}
        aria-label={t("tryDemo.qrOpen")}
      >
        <Image
          src={DEMO_QR_IMAGE}
          alt={t("tryDemo.qrTitle")}
          width={DEMO_QR_SIZE}
          height={DEMO_QR_SIZE}
          unoptimized
        />
      </a>
      <div className={styles.qrContent}>
        <span className={styles.qrTitle}>
          <QrCodeIcon size={20} />
          {t("tryDemo.qrTitle")}
        </span>
        <p className={styles.qrText}>{t("tryDemo.qrText")}</p>
        <div className={styles.qrActions}>
          <a
            href={LINKS.demo.chooser}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.qrPrimary}
          >
            {t("tryDemo.qrOpen")}
          </a>
          {showMore ? (
            <Link
              href={LINKS.pages.qrCode}
              className={styles.qrSecondary}
              onClick={() =>
                reachGoal("click_solution", { page: "qr", from: "try_demo" })
              }
            >
              {t("tryDemo.qrMore")} →
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
