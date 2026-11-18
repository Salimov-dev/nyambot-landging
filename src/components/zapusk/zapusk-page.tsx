import { typograph } from "@/lib/typography/typograph";
import { ZAPUSK_HOW, ZAPUSK_PAGE } from "@/config/zapusk-page.config";
import { LandingPageShell } from "@/components/landing-page/landing-page-shell";
import landingStyles from "@/components/landing-page/landing-page.module.css";
import { BriefArea } from "./brief/brief-area";
import { StepsCard } from "./brief/steps-card";
import styles from "./zapusk.module.css";

/**
 * Страница «Заявка на запуск» — сюда ведёт «Запустим за тебя бесплатно»
 * (план `brif-zapuska-2026-10-09`, Ф2).
 *
 * Сначала ближайший шаг и форма, затем подробный порядок подключения.
 */
export function ZapuskPage() {
  return (
    <LandingPageShell wide>
      <main className={landingStyles.main}>
        <div className={styles.intro}>
          <span className={landingStyles.label}>{ZAPUSK_PAGE.label}</span>
          <h1 className={`${landingStyles.heading} ${styles.heading}`}>
            {ZAPUSK_PAGE.headingLines.map((line) => (
              <span key={line} className={styles.headingLine}>
                {typograph(line)}
              </span>
            ))}
          </h1>
          <p className={landingStyles.lead}>{typograph(ZAPUSK_PAGE.lead)}</p>
        </div>

        <section className={styles.formSection} id="zayavka">
          <BriefArea />
          <div className={styles.how}>
            <StepsCard content={ZAPUSK_HOW} />
          </div>
        </section>
      </main>
    </LandingPageShell>
  );
}
