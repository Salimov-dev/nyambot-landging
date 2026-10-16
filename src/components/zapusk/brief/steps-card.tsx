import {
  ZAPUSK_STEP_MARK,
  type ZapuskStepsCardContent,
} from "@/config/zapusk-page.config";
import { glueDash, typograph } from "@/lib/typography/typograph";
import styles from "./steps-card.module.css";

type IProps = {
  content: ZapuskStepsCardContent;
  /** Отметить первый шаг сделанным — после отправки заявки. */
  firstDone?: boolean;
};

/**
 * Карточка с нумерованными шагами страницы `/zapusk`: заголовок шага
 * строкой, пояснение под ним. Над формой — «Как мы работаем», под формой —
 * «Что будет после заявки» (Руслан 16.10.2026).
 */
export function StepsCard({ content, firstDone = false }: IProps) {
  return (
    <aside className={styles.card} aria-labelledby={content.titleId}>
      <h2 id={content.titleId} className={styles.title}>
        {content.title}
      </h2>
      <ol className={styles.list}>
        {content.steps.map((step, index) => {
          const done = firstDone && index === 0;
          return (
            <li
              key={step.title}
              className={
                done ? `${styles.step} ${styles.stepDone}` : styles.step
              }
            >
              <span className={styles.mark} aria-hidden="true">
                {done ? ZAPUSK_STEP_MARK.done : index + 1}
              </span>
              <div className={styles.text}>
                <strong className={styles.stepTitle}>
                  {glueDash(step.title)}
                  {done ? (
                    <span className={styles.srOnly}>
                      {ZAPUSK_STEP_MARK.doneLabel}
                    </span>
                  ) : null}
                </strong>
                <span className={styles.stepText}>{typograph(step.text)}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
