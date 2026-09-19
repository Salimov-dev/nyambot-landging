"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Flex, Typography } from "antd";
import { Logo } from "@/components/common/logo/logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher/language-switcher";
import { useLandingStore } from "@/store/use-landing.store";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import {
  getSkolkovoLogo,
  getSkolkovoLogoSize,
  SKOLKOVO_LOGO_KIND,
} from "@/config/skolkovo.config";
import styles from "./header.module.css";

const { Text } = Typography;

/** Целей на пунктах нет: показ секции отмечает SectionViewTracker — клик по
 *  пункту всё равно прокручивает страницу к ней. */
const NAV_ITEMS = [
  { labelKey: "nav.features", href: "#features" },
  { labelKey: "nav.pricing", href: "#pricing" },
  { labelKey: "nav.faq", href: "#faq" },
] as const;

/** Вынесенные страницы: на десктопе раскрываются списком в шапке, на телефоне
 *  пункт «Решения» ведёт якорем на одноимённый блок с теми же карточками —
 *  вложенный список в бургер-меню стоил бы двух тапов. */
const SOLUTION_LINKS = [
  {
    id: "features",
    labelKey: "solutions.items.features.title",
    href: LINKS.pages.features,
  },
  {
    id: "network",
    labelKey: "solutions.items.network.title",
    href: LINKS.pages.network,
  },
  {
    id: "ownChannels",
    labelKey: "solutions.items.ownChannels.title",
    href: LINKS.pages.ownChannels,
  },
  {
    id: "security",
    labelKey: "solutions.items.security.title",
    href: LINKS.pages.security,
  },
  {
    id: "faq",
    labelKey: "solutions.items.faq.title",
    href: LINKS.pages.faq,
  },
] as const;

/** На телефоне «Решения» — якорь на блок карточек внизу страницы */
const MOBILE_NAV_ITEMS = [
  { labelKey: "nav.features", href: "#features" },
  { labelKey: "nav.solutions", href: "#solutions" },
  { labelKey: "nav.pricing", href: "#pricing" },
  { labelKey: "nav.faq", href: "#faq" },
] as const;

export function Header() {
  const { t, i18n } = useTranslation("landing");
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu } =
    useLandingStore();
  const skolkovoLogo = getSkolkovoLogo(
    i18n.language,
    SKOLKOVO_LOGO_KIND.HORIZONTAL,
  );

  return (
    <header className={styles.header}>
      <Flex align="center" gap={32} className={styles.inner}>
        <Link href="/" className={styles.logoLink}>
          <Logo size="md" />
        </Link>

        {/* Desktop nav */}
        <Flex align="center" gap={4} className={styles.nav}>
          <a href="#features" className={styles.navLink}>
            <Text style={{ fontSize: 14, fontWeight: 500 }}>
              {t("nav.features")}
            </Text>
          </a>

          <div className={styles.navDropdown}>
            <button type="button" className={styles.navLink}>
              <Text style={{ fontSize: 14, fontWeight: 500 }}>
                {t("nav.solutions")}
              </Text>
              <span className={styles.navCaret} aria-hidden="true">
                ▾
              </span>
            </button>
            <div className={styles.navPanel}>
              {SOLUTION_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.navPanelLink}
                  onClick={() =>
                    reachGoal("click_solution", {
                      page: item.id,
                      from: "menu",
                    })
                  }
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </div>
          </div>

          {NAV_ITEMS.filter((item) => item.href !== "#features").map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              <Text style={{ fontSize: 14, fontWeight: 500 }}>
                {t(item.labelKey)}
              </Text>
            </a>
          ))}
        </Flex>

        <Flex align="center" gap={8} className={styles.actions}>
          <Button
            type="text"
            href={LINKS.docs}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.docsBtn}
          >
            {t("nav.docs")}
          </Button>
          <Button
            type="primary"
            href={LINKS.crm}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
            size="middle"
            onClick={() => reachGoal("click_trial")}
          >
            {/* Короткое «CRM»: рядом со знаком Фонда кнопка «Открыть CRM» была
                с ним одной длины, и два блока сливались в один. В бургер-меню
                кнопка растянута на всю ширину — там остаётся полный текст */}
            {t("nav.crm")}
          </Button>

          {/* Переключатель языка стоит между кнопкой CRM и знаком Фонда
              намеренно: оранжевая кнопка и зелёный логотип вплотную сливались
              в одно цветное пятно, а плашка языка разбивает их нейтральным */}
          <LanguageSwitcher />

          {/* Статус участника «Сколково» — у правого края, максимально далеко от
              логотипа Нямбота: рядом с ним два знака читались как один составной
              бренд. Высота 34 px — минимум по Коммуникационному пакету Фонда,
              уменьшать нельзя, поэтому на телефонах знак показан внизу hero */}
          <a
            href={LINKS.skolkovo}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.skolkovoLink}
            aria-label={t("skolkovo.alt")}
          >
            <Image
              src={skolkovoLogo.src}
              alt={t("skolkovo.alt")}
              {...getSkolkovoLogoSize(skolkovoLogo, 34)}
              className={styles.skolkovoLogo}
              priority
            />
          </a>
        </Flex>

        {/* Mobile burger */}
        <button
          className={styles.burger}
          onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
          aria-label="Меню"
        >
          <span
            className={`${styles.burgerLine} ${isMobileMenuOpen ? styles.open : ""}`}
          />
          <span
            className={`${styles.burgerLine} ${isMobileMenuOpen ? styles.open : ""}`}
          />
          <span
            className={`${styles.burgerLine} ${isMobileMenuOpen ? styles.open : ""}`}
          />
        </button>
      </Flex>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >
            {MOBILE_NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={styles.mobileNavLink}
                onClick={() => {
                  closeMobileMenu();
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: 500 }}>
                  {t(item.labelKey)}
                </Text>
              </a>
            ))}
            <a
              href={LINKS.docs}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileNavLink}
              onClick={closeMobileMenu}
            >
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {t("nav.docs")}
              </Text>
            </a>
            <Button
              type="primary"
              href={LINKS.crm}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileCtaBtn}
              block
              size="large"
              onClick={() => reachGoal("click_trial")}
            >
              {t("nav.openCrm")}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
