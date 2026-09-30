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
  ZapIcon,
  MegaphoneIcon,
  ChartIcon,
  BulbIcon,
  StoreIcon,
  QrCodeIcon,
} from "@/components/ui/icons/icons";
import Link from "next/link";
import { FreeReviewSection } from "@/components/sections/free-review/free-review-section";
import { DemoQrBlock } from "@/components/sections/try-demo/demo-qr-block";
import { LandingPageCta } from "./landing-page-cta";
import { LandingPageShell } from "./landing-page-shell";
import styles from "./landing-page.module.css";

const PAGE_TEXT = {
  notNeededTitle: "Не нужно",
  guideTitle: "Как это настроить",
  faqTitle: "Частые вопросы",
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
  [BLOCK_ICON.ALERT]: ZapIcon,
  [BLOCK_ICON.BROADCAST]: MegaphoneIcon,
  [BLOCK_ICON.METRICS]: ChartIcon,
  [BLOCK_ICON.INSIGHT]: BulbIcon,
  [BLOCK_ICON.BRAND]: StoreIcon,
  [BLOCK_ICON.QR]: QrCodeIcon,
};

type IProps = {
  content: ILandingPageContent;
};

/**
 * Посадочная страница под поисковый запрос.
 *
 * Вёрстка своя, без компонентов Ant: у страницы одна задача — быстро
 * показаться человеку из выдачи, а стили Ant приезжают вместе с JS. Шапка и
 * подвал — общий каркас `LandingPageShell`.
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
    <LandingPageShell>
      <main className={styles.main}>
        <span className={styles.label}>{content.label}</span>
        <h1 className={styles.heading}>{content.heading}</h1>
        <p className={styles.lead}>{content.lead}</p>

        <LandingPageCta />

        {/* Страницы про общий QR-код и брендирование показывают сам код:
            навести телефон убедительнее любого описания */}
        {content.demoQr ? <DemoQrBlock showMore={false} inPage /> : null}

        <div className={styles.blocks}>
          {content.blocks.map((block) => {
            const Icon = ICONS[block.icon];

            return (
              <section
                key={block.title}
                className={
                  block.wide
                    ? `${styles.block} ${styles.blockWide}`
                    : styles.block
                }
              >
                <span className={styles.blockIcon}>
                  <Icon size={20} />
                </span>
                <h2 className={styles.blockTitle}>{block.title}</h2>
                <p className={styles.blockText}>{block.text}</p>
                {block.points ? (
                  <ul className={styles.blockPoints}>
                    {block.points.map((point) => (
                      <li key={point} className={styles.blockPoint}>
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {block.link ? (
                  <Link href={block.link.href} className={styles.blockLink}>
                    {block.link.label} →
                  </Link>
                ) : null}
              </section>
            );
          })}
        </div>

        {content.notNeeded ? (
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
        ) : null}

        {/* Бесплатный разбор — на каждой посадочной, как на главной: страница
            отвечает на запрос, а блок даёт следующий шаг (28.09.2026) */}
        <FreeReviewSection embedded />

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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </LandingPageShell>
  );
}
