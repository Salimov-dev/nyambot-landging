"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BRAND_CONFIG } from "@/config/brand.config";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import { TelegramIcon } from "@/components/ui/messenger-icons/telegram-icon";
import { MaxIcon } from "@/components/ui/messenger-icons/max-icon";
import { CloseIcon, MailIcon, MessageIcon } from "@/components/ui/icons/icons";
import styles from "./contact-widget.module.css";

/** Откуда пришла цель Метрики: отличает кнопку связи от подвала и FAQ. */
const GOAL_SOURCE = { from: "contact_widget" } as const;

const CHANNEL_ICON_SIZE = 28;

/**
 * Плавающая кнопка связи (план аудита Гуляша, С7, Руслан 28.09.2026): видна
 * при любой прокрутке, по нажатию — Телеграм, MAX и почта.
 *
 * Все три канала открываются сразу: Телеграм и MAX — профилем поддержки,
 * почта — письмом.
 *
 * Закрывается повторным нажатием, кликом мимо и Esc.
 */
export function ContactWidget() {
  const { t } = useTranslation("landing");
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen, close]);

  const toggle = () => {
    if (!isOpen) reachGoal("open_contact_widget");
    setIsOpen((open) => !open);
  };

  return (
    <div ref={rootRef} className={styles.root}>
      {isOpen && (
        <div id={panelId} className={styles.panel} role="dialog">
          <p className={styles.title}>{t("contactWidget.title")}</p>

          <a
            className={styles.channel}
            href={LINKS.support.telegram}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => reachGoal("click_tg_support", GOAL_SOURCE)}
          >
            <TelegramIcon size={CHANNEL_ICON_SIZE} />
            <span className={styles.channelText}>
              <span className={styles.channelName}>
                {t("contactWidget.telegram")}
              </span>
              <span className={styles.channelValue}>
                {BRAND_CONFIG.supportTelegramHandle}
              </span>
            </span>
          </a>

          <a
            className={styles.channel}
            href={LINKS.support.max}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => reachGoal("click_max_support", GOAL_SOURCE)}
          >
            <MaxIcon size={CHANNEL_ICON_SIZE} />
            <span className={styles.channelText}>
              <span className={styles.channelName}>
                {t("contactWidget.max")}
              </span>
              <span className={styles.channelValue}>
                {BRAND_CONFIG.supportMaxPhoneDisplay}
              </span>
            </span>
          </a>

          <a
            className={styles.channel}
            href={LINKS.support.email}
            onClick={() => reachGoal("click_email_support", GOAL_SOURCE)}
          >
            <span className={styles.mailIcon}>
              <MailIcon size={18} />
            </span>
            <span className={styles.channelText}>
              <span className={styles.channelName}>
                {t("contactWidget.email")}
              </span>
              <span className={styles.channelValue}>
                {BRAND_CONFIG.supportEmail}
              </span>
            </span>
          </a>
        </div>
      )}

      <button
        type="button"
        className={styles.fab}
        aria-label={t("contactWidget.ariaLabel")}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={toggle}
      >
        {isOpen ? <CloseIcon size={24} /> : <MessageIcon size={24} />}
      </button>
    </div>
  );
}
