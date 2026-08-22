"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Col, Divider, Flex, Row, Typography } from "antd";
import { Logo } from "@/components/common/logo/logo";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import { BRAND_CONFIG } from "@/config/brand.config";
import { theme } from "@/config/theme";
import {
  getSkolkovoLogo,
  getSkolkovoLogoSize,
  SKOLKOVO_LOGO_KIND,
} from "@/config/skolkovo.config";
import { ShieldIcon } from "@/components/ui/icons/icons";
import styles from "./footer.module.css";

const { Text, Link } = Typography;

export function Footer() {
  const { t, i18n } = useTranslation("landing");
  const year = new Date().getFullYear();
  const skolkovoLogo = getSkolkovoLogo(
    i18n.language,
    SKOLKOVO_LOGO_KIND.VERTICAL,
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Row gutter={[32, 40]}>
          {/* На планшете колонки ссылок сжимались до 128 px и слова рвались
              по слогам («ЮРИДИЧЕСК/ОЕ»). Четыре колонки в ряд — только с 992 px */}
          <Col xs={24} sm={24} md={24} lg={8}>
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

          <Col xs={12} sm={12} md={6} lg={4}>
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
                href={LINKS.crew}
                target="_blank"
                className={styles.footerLink}
              >
                {t("footer.crew")}
              </Link>
              <Link
                href={LINKS.docs}
                target="_blank"
                className={styles.footerLink}
              >
                {t("footer.docs")}
              </Link>
              <Link href="#pricing" className={styles.footerLink}>
                {t("footer.pricing")}
              </Link>
            </Flex>
          </Col>

          {/* Отдельная колонка, а не хвост «Продукта»: вместе с CRM,
              «Командой» и документацией получался список из семи пунктов,
              который читается дольше, чем весь остальной подвал */}
          <Col xs={12} sm={12} md={6} lg={4}>
            <Flex vertical gap={12}>
              <Text strong className={styles.colTitle}>
                {t("footer.solutions")}
              </Text>
              <Link href={LINKS.pages.iiko} className={styles.footerLink}>
                {t("footer.pageIiko")}
              </Link>
              <Link href={LINKS.pages.rkeeper} className={styles.footerLink}>
                {t("footer.pageRkeeper")}
              </Link>
              <Link href={LINKS.pages.messengers} className={styles.footerLink}>
                {t("footer.pageMessengers")}
              </Link>
            </Flex>
          </Col>

          <Col xs={12} sm={12} md={6} lg={4}>
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
              {/* TODO: раскомментировать когда MAX добавит поддержку */}
              {/* <Link
                href={LINKS.support.max}
                target="_blank"
                className={styles.footerLink}
                onClick={() => reachGoal("click_max_support")}
              >
                {t("footer.max")}
              </Link> */}
              <Link
                href={`mailto:${BRAND_CONFIG.supportEmail}`}
                className={styles.footerLink}
              >
                {BRAND_CONFIG.supportEmail}
              </Link>
            </Flex>
          </Col>

          <Col xs={12} sm={12} md={6} lg={4}>
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
              <Link href={LINKS.legal.tariffs} className={styles.footerLink}>
                {t("footer.tariffs")}
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
          <Flex vertical gap={6}>
            {/* Российское происхождение и хранение данных — для B2B это
                такой же аргумент, как цена: показываем явно, а не только
                внутри секции «Безопасность» */}
            <Flex align="center" gap={8} className={styles.madeInRussia}>
              <ShieldIcon size={15} />
              <Text className={styles.madeInRussiaText}>
                {t("footer.madeInRussia")}
              </Text>
            </Flex>
            {/* Статус участника показывает логотип Фонда справа — дублировать
                его строкой с номером реестра незачем: кому нужно подтверждение,
                тому даём выписку */}
            <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>
              © {year} {BRAND_CONFIG.name}. {t("footer.allRights")}
            </Text>
            <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
              ООО «Нямбот», ОГРН 1264700010233, ИНН 4706098700
            </Text>
            {/* Названия и логотипы iiko, R-Keeper, ЮKassa, Яндекс.Пэй и
                Яндекс.Доставки стоят в блоке «Интеграции» — они указывают на
                совместимость, а не на принадлежность. Оговорка снимает вопрос
                правообладателя раньше, чем он его задаст */}
            <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
              {t("footer.trademarks")}
            </Text>
          </Flex>
          {/* Баннерная кнопка участника проекта: Положение допускает в подвале
              и вертикальную версию логотипа. Домен уходит под знак, чтобы
              вокруг логотипа осталось охранное поле */}
          <Flex
            vertical
            align="center"
            gap={10}
            className={styles.skolkovoMark}
          >
            <a
              href={LINKS.skolkovo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("skolkovo.alt")}
              className={styles.skolkovoLogoLink}
            >
              <Image
                src={skolkovoLogo.src}
                alt={t("skolkovo.alt")}
                {...getSkolkovoLogoSize(skolkovoLogo, 84)}
              />
            </a>
            <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>
              {BRAND_CONFIG.siteName}
            </Text>
          </Flex>
        </Flex>
      </div>
    </footer>
  );
}
