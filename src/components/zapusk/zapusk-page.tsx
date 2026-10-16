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
 * Сверху — пометка «Заявка на запуск» и заголовок, под ними «Как мы
 * работаем» — весь путь запуска, чтобы порядок был понятен до заполнения;
 * дальше форма и под ней «Что будет после заявки» (Руслан 16.10.2026,
 * план «Порядок запуска клиента», Ф6 п. 3а). Строки «Хочешь настроить сам?
 * Зарегистрироваться» под формой больше нет: саморегистрация в СРМ закрыта,
 * кабинет заводим мы по заявке (Руслан 17.10.2026).
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
        </div>

        <section className={styles.formSection} id="zayavka">
          <div className={styles.how}>
            <StepsCard content={ZAPUSK_HOW} />
          </div>
          <BriefArea />
        </section>
      </main>
    </LandingPageShell>
  );
}
