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
  inSide = false,
  scanning = false,
}: {
  /** Ссылка на страницу про общий QR-код — не нужна на самой этой странице. */
  showMore?: boolean;
  /** Внутри посадочной: во всю ширину контента и с отступом до карточек, а
   *  не узкой плашкой по центру секции демо. */
  inPage?: boolean;
  /** В колонке рядом с роликом демо на главной: во всю ширину колонки. */
  inSide?: boolean;
  /** По коду проходит линия сканирования — будто на него навели камеру. */
  scanning?: boolean;
}) {
  const { t } = useTranslation("landing");

  const title = (
    <span className={styles.qrTitle}>
      <QrCodeIcon size={20} />
      {t("tryDemo.qrTitle")}
    </span>
  );
  const more = showMore ? (
    <Link
      href={LINKS.pages.qrCode}
      className={styles.qrSecondary}
      onClick={() =>
        reachGoal("click_solution", { page: "qr", from: "try_demo" })
      }
    >
      {t("tryDemo.qrMore")} →
    </Link>
  ) : null;

  return (
    <div
      className={[
        styles.qrBlock,
        inPage ? styles.qrBlockInPage : "",
        inSide ? styles.qrBlockSide : "",
      ].join(" ")}
    >
      {/* В колонке демо: заголовок сверху и «Как это работает» снизу — по
          центру, между ними код и текст одной высоты (Руслан 06.10.2026) */}
      {inSide ? title : null}
      <a
        href={LINKS.demo.chooser}
        target="_blank"
        onClick={() => reachGoal("open_demo_chooser")}
        rel="noopener noreferrer"
        className={`${styles.qrImageWrap} ${scanning ? styles.qrScanning : ""}`}
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
        {inSide ? null : title}
        <p className={styles.qrText}>{t("tryDemo.qrText")}</p>
        <div className={styles.qrActions}>
          <a
            href={LINKS.demo.chooser}
            target="_blank"
            onClick={() => reachGoal("open_demo_chooser")}
            rel="noopener noreferrer"
            className={styles.qrPrimary}
          >
            {t("tryDemo.qrOpen")}
          </a>
          {inSide ? null : more}
        </div>
      </div>
      {inSide ? more : null}
    </div>
  );
}
