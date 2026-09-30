import { noWidow } from "@/lib/typography/no-widow";
import { LINKS } from "@/config/links.config";
import { ZAPUSK_PAGE } from "@/config/zapusk-page.config";
import { LandingPageShell } from "@/components/landing-page/landing-page-shell";
import landingStyles from "@/components/landing-page/landing-page.module.css";
import { LeadForm } from "./lead-form";
import styles from "./zapusk.module.css";

/**
 * Страница «Сами запустим твоё заведение» — сюда ведёт «Начать бесплатно».
 *
 * Сверху — пять шагов плитками, как карточки других посадочных, под ними —
 * форма во всю ширину, с крупными полями (решение Руслана 28.09.2026: форма
 * рядом с текстом была длинной узкой колонкой). «Зарегистрироваться самому»
 * на телефоне скрыт: в СРМ с телефона не поработать.
 */
export function ZapuskPage() {
  return (
    <LandingPageShell wide>
      <main className={landingStyles.main}>
        <h1 className={`${landingStyles.heading} ${styles.heading}`}>
          {noWidow(ZAPUSK_PAGE.heading)}
        </h1>
        <p className={`${landingStyles.lead} ${styles.lead}`}>
          {ZAPUSK_PAGE.lead}
        </p>

        <section className={styles.steps}>
          <h2 className={landingStyles.sectionTitle}>
            {ZAPUSK_PAGE.stepsTitle}
          </h2>
          <ol className={styles.stepGrid}>
            {ZAPUSK_PAGE.steps.map((step, index) => (
              <li
                key={step.title}
                className={`${landingStyles.block} ${styles.stepTile}`}
              >
                <span className={styles.stepNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <h3 className={landingStyles.blockTitle}>{step.title}</h3>
                <p className={landingStyles.blockText}>{noWidow(step.text)}</p>
                {"link" in step ? (
                  <a
                    href={step.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.stepLink}
                  >
                    {step.link.label} →
                  </a>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.formSection} id="zayavka">
          <LeadForm />
          <p className={styles.replyPromise}>{ZAPUSK_PAGE.replyPromise}</p>
          <p className={styles.selfServe}>
            {ZAPUSK_PAGE.selfServe}{" "}
            <a
              href={LINKS.crmRegister}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.selfServeLink}
            >
              {ZAPUSK_PAGE.selfServeLink} →
            </a>
          </p>
        </section>
      </main>
    </LandingPageShell>
  );
}
