import { typograph } from "@/lib/typography/typograph";
import {
  isPhoneVisual,
  type ILandingPageContent,
} from "@/config/landing-pages.config";
import { LinkedText } from "./linked-text";
import { PageVisual } from "./page-visual";
import { LandingBlock } from "./landing-block";
import { HomeSections } from "./home-sections";
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

  const phoneVisual = content.visual && isPhoneVisual(content.visual);

  return (
    <LandingPageShell>
      <main className={styles.main}>
        {/* Живой первый экран (Руслан 06.10.2026): телефон — рядом с
            заголовком, широкий ролик — под кнопками */}
        <div className={phoneVisual ? styles.intro : undefined}>
          <div>
            <span className={styles.label}>{content.label}</span>
            <h1 className={styles.heading}>{typograph(content.heading)}</h1>
            <p className={styles.lead}>{typograph(content.lead)}</p>

            <LandingPageCta />
          </div>
          {phoneVisual && content.visual ? (
            <PageVisual visual={content.visual} />
          ) : null}
        </div>

        {content.visual && !phoneVisual ? (
          <PageVisual visual={content.visual} />
        ) : null}

        {/* Страницы про общий QR-код и брендирование показывают сам код:
            навести телефон убедительнее любого описания */}
        {content.demoQr ? <DemoQrBlock showMore={false} inPage /> : null}

        <div className={styles.blocks}>
          {content.blocks.map((block, index) => (
            <LandingBlock key={block.title} block={block} index={index} />
          ))}
        </div>

        {content.notNeeded ? (
          <section className={styles.notNeeded}>
            <h2 className={styles.sectionTitle}>{PAGE_TEXT.notNeededTitle}</h2>
            <ul className={styles.notNeededList}>
              {content.notNeeded.map((item) => (
                <li key={item} className={styles.notNeededItem}>
                  {typograph(item)}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>

      {content.homeSections?.length ? (
        <HomeSections sections={content.homeSections} />
      ) : null}

      <div className={`${styles.main} ${styles.mainTail}`}>
        {/* Бесплатный запуск — на каждой посадочной, как на главной: страница
            отвечает на запрос, а блок даёт следующий шаг (28.09.2026) */}
        <FreeReviewSection embedded />

        <section className={styles.faq}>
          <h2 className={styles.sectionTitle}>{PAGE_TEXT.faqTitle}</h2>
          <div className={styles.faqList}>
            {content.faq.map((item) => (
              <div key={item.question} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>
                  {typograph(item.question)}
                </h3>
                <p className={styles.faqAnswer}>
                  <LinkedText text={item.answer} />
                </p>
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
          <span className={styles.guideText}>
            {typograph(content.guide.label)}
          </span>
          <span className={styles.guideArrow} aria-hidden="true">
            →
          </span>
        </a>

        <LandingPageCta />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </LandingPageShell>
  );
}
