"use client";

import { useTranslation } from "react-i18next";
import { Col, Divider, Flex, Row, Typography } from "antd";
import { Logo } from "@/components/common/logo/logo";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import { BRAND_CONFIG } from "@/config/brand.config";
import { theme } from "@/config/theme";
import styles from "./footer.module.css";

const { Text, Link } = Typography;

export function Footer() {
  const { t } = useTranslation("landing");
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Row gutter={[32, 40]}>
          <Col xs={24} sm={24} md={8}>
            <Flex vertical gap={16}>
              <Logo size="md" />
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: 14,
                  lineHeight: 1.6,
                  maxWidth: 260,
                }}
              >
                {t("footer.description")}
              </Text>
            </Flex>
          </Col>

          <Col xs={12} sm={8} md={4}>
            <Flex vertical gap={12}>
              <Text strong className={styles.colTitle}>
                {t("footer.product")}
              </Text>
              <Link
                href={LINKS.crm}
                target="_blank"
                className={styles.footerLink}
                onClick={() => reachGoal("click_trial")}
              >
                {t("footer.crm")}
              </Link>
              <Link
                href={LINKS.docs}
                target="_blank"
                className={styles.footerLink}
              >
                {t("footer.docs")}
              </Link>
              <Link
                href="#pricing"
                className={styles.footerLink}
                onClick={() => reachGoal("scroll_pricing")}
              >
                {t("footer.pricing")}
              </Link>
            </Flex>
          </Col>

          <Col xs={12} sm={8} md={4}>
            <Flex vertical gap={12}>
              <Text strong className={styles.colTitle}>
                {t("footer.support")}
              </Text>
              <Link
                href={LINKS.support.telegram}
                target="_blank"
                className={styles.footerLink}
                onClick={() => reachGoal("click_tg_support")}
              >
                {t("footer.telegram")}
              </Link>
              <Link
                href={LINKS.support.max}
                target="_blank"
                className={styles.footerLink}
                onClick={() => reachGoal("click_max_demo")}
              >
                {t("footer.max")}
              </Link>
              <Link
                href={`mailto:${BRAND_CONFIG.supportEmail}`}
                className={styles.footerLink}
              >
                {BRAND_CONFIG.supportEmail}
              </Link>
            </Flex>
          </Col>

          <Col xs={24} sm={8} md={4}>
            <Flex vertical gap={12}>
              <Text strong className={styles.colTitle}>
                {t("footer.legal")}
              </Text>
              <Link href={LINKS.legal.privacy} className={styles.footerLink}>
                {t("footer.privacy")}
              </Link>
              <Link href={LINKS.legal.terms} className={styles.footerLink}>
                {t("footer.terms")}
              </Link>
              <Link href={LINKS.legal.offer} className={styles.footerLink}>
                {t("footer.offer")}
              </Link>
              <Link href={LINKS.legal.cookies} className={styles.footerLink}>
                {t("footer.cookies")}
              </Link>
            </Flex>
          </Col>
        </Row>

        <Divider style={{ margin: "40px 0 24px" }} />

        <Flex
          justify="space-between"
          align="center"
          wrap
          gap={8}
          className={styles.bottom}
        >
          <Flex vertical gap={4}>
            <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>
              © {year} {BRAND_CONFIG.name}. {t("footer.allRights")}
            </Text>
            <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
              ИП Салимов Р.А., ИНН 183401217970
            </Text>
          </Flex>
          <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>
            {BRAND_CONFIG.siteName}
          </Text>
        </Flex>
      </div>
    </footer>
  );
}
