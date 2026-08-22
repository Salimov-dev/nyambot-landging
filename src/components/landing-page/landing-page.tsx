import Link from "next/link";
import { BRAND_CONFIG } from "@/config/brand.config";
import { LINKS } from "@/config/links.config";
import {
  BLOCK_ICON,
  type IBlockIcon,
  type ILandingPageContent,
} from "@/config/landing-pages.config";
import {
  ListIcon,
  CartIcon,
  WalletIcon,
  PercentIcon,
  ToolsIcon,
  MessageIcon,
  MonitorIcon,
  MapIcon,
} from "@/components/ui/icons/icons";
import { StructuredData } from "@/components/common/structured-data/structured-data";
import { LandingPageCta } from "./landing-page-cta";
import styles from "./landing-page.module.css";

const PAGE_TEXT = {
  home: "Главная",
  notNeededTitle: "Не нужно",
  guideTitle: "Как это настроить",
  faqTitle: "Частые вопросы",
  legal: "Публичная оферта",
  rights: "Все права защищены",
} as const;

const ICONS: Record<IBlockIcon, typeof ListIcon> = {
  [BLOCK_ICON.MENU]: ListIcon,
  [BLOCK_ICON.ORDER]: CartIcon,
  [BLOCK_ICON.MONEY]: WalletIcon,
  [BLOCK_ICON.PROMO]: PercentIcon,
  [BLOCK_ICON.SETUP]: ToolsIcon,
  [BLOCK_ICON.GUEST]: MessageIcon,
  [BLOCK_ICON.STAFF]: MonitorIcon,
  [BLOCK_ICON.DELIVERY]: MapIcon,
};

type IProps = {
  content: ILandingPageContent;
};

/**
 * Оболочка посадочной страницы под поисковый запрос.
 *
 * Вёрстка своя, без компонентов Ant: у страницы одна задача — быстро
 * показаться человеку из выдачи, а стили Ant приезжают вместе с JS. Шапка
 * здесь тоже своя: у главной пункты меню — якоря вида «#pricing», и на
 * отдельной странице они вели бы в никуда.
 */
export function LandingPage({ content }: IProps) {
  /* Разметка вопросов — за расширенным сниппетом в выдаче. Берётся из тех же
     текстов, что видит человек: расхождение поисковики считают обманом. */
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className={styles.page}>
      <StructuredData />
      <div className={styles.glow} />

      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          {BRAND_CONFIG.name}
        </Link>
        <Link href="/" className={styles.homeLink}>
          {PAGE_TEXT.home}
        </Link>
      </header>

      <main className={styles.main}>
        <span className={styles.label}>{content.label}</span>
        <h1 className={styles.heading}>{content.heading}</h1>
        <p className={styles.lead}>{content.lead}</p>

        <LandingPageCta />

        <div className={styles.blocks}>
          {content.blocks.map((block) => {
            const Icon = ICONS[block.icon];

            return (
              <section key={block.title} className={styles.block}>
                <span className={styles.blockIcon}>
                  <Icon size={20} />
                </span>
                <h2 className={styles.blockTitle}>{block.title}</h2>
                <p className={styles.blockText}>{block.text}</p>
              </section>
            );
          })}
        </div>

        <section className={styles.notNeeded}>
          <h2 className={styles.sectionTitle}>{PAGE_TEXT.notNeededTitle}</h2>
          <ul className={styles.notNeededList}>
            {content.notNeeded.map((item) => (
              <li key={item} className={styles.notNeededItem}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.faq}>
          <h2 className={styles.sectionTitle}>{PAGE_TEXT.faqTitle}</h2>
          <div className={styles.faqList}>
            {content.faq.map((item) => (
              <div key={item.question} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{item.question}</h3>
                <p className={styles.faqAnswer}>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <a
          href={content.guide.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.guideCard}
        >
          <span className={styles.guideLabel}>{PAGE_TEXT.guideTitle}</span>
          <span className={styles.guideText}>{content.guide.label}</span>
          <span className={styles.guideArrow} aria-hidden="true">
            →
          </span>
        </a>

        <LandingPageCta />
      </main>

      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} {BRAND_CONFIG.name} · {PAGE_TEXT.rights}
        </span>
        <Link href={LINKS.legal.offer} className={styles.footerLink}>
          {PAGE_TEXT.legal}
        </Link>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
