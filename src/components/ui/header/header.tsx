"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Flex, Typography } from "antd";
import { Logo } from "@/components/common/logo/logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher/language-switcher";
import { useLandingStore } from "@/store/use-landing.store";
import { LINKS } from "@/config/links.config";
import styles from "./header.module.css";

const { Text } = Typography;

const NAV_ITEMS = [
  { labelKey: "nav.features", href: "#features" },
  { labelKey: "nav.howItWorks", href: "#how-it-works" },
  { labelKey: "nav.pricing", href: "#pricing" },
  { labelKey: "nav.faq", href: "#faq" },
] as const;

export function Header() {
  const { t } = useTranslation("landing");
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useLandingStore();

  return (
    <header className={styles.header}>
      <Flex align="center" gap={32} className={styles.inner}>
        <Link href="/" className={styles.logoLink}>
          <Logo size="md" />
        </Link>

        {/* Desktop nav */}
        <Flex align="center" gap={4} className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              <Text style={{ fontSize: 14, fontWeight: 500 }}>{t(item.labelKey)}</Text>
            </a>
          ))}
        </Flex>

        <Flex align="center" gap={8} className={styles.actions}>
          <LanguageSwitcher />
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
          >
            {t("nav.openCrm")}
          </Button>
        </Flex>

        {/* Mobile burger */}
        <button
          className={styles.burger}
          onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
          aria-label="Меню"
        >
          <span className={`${styles.burgerLine} ${isMobileMenuOpen ? styles.open : ""}`} />
          <span className={`${styles.burgerLine} ${isMobileMenuOpen ? styles.open : ""}`} />
          <span className={`${styles.burgerLine} ${isMobileMenuOpen ? styles.open : ""}`} />
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
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
              >
                <Text style={{ fontSize: 16, fontWeight: 500 }}>{t(item.labelKey)}</Text>
              </a>
            ))}
            <a
              href={LINKS.docs}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileNavLink}
              onClick={closeMobileMenu}
            >
              <Text style={{ fontSize: 16, fontWeight: 500 }}>{t("nav.docs")}</Text>
            </a>
            <Button
              type="primary"
              href={LINKS.crm}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileCtaBtn}
              block
              size="large"
            >
              {t("nav.openCrm")}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
