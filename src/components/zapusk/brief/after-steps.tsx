import { ZAPUSK_AFTER } from "@/config/zapusk-page.config";
import styles from "./after-steps.module.css";

/**
 * «Что будет после заявки» — справа от короткой формы, четыре коротких шага:
 * заголовок шага строкой, пояснение под ним. После отправки первый шаг
 * отмечен сделанным.
 */
export function AfterSteps({ sent }: { sent: boolean }) {
  return (
    <aside className={styles.card} aria-labelledby="zapusk-after-title">
      <h2 id="zapusk-after-title" className={styles.title}>
        {ZAPUSK_AFTER.title}
      </h2>
      <ol className={styles.list}>
        {ZAPUSK_AFTER.steps.map((step, index) => {
          const done = sent && index === 0;
          return (
            <li
              key={step.title}
              className={
                done ? `${styles.step} ${styles.stepDone}` : styles.step
              }
            >
              <span className={styles.mark} aria-hidden="true">
                {done ? ZAPUSK_AFTER.doneMark : index + 1}
              </span>
              <div className={styles.text}>
                <strong className={styles.stepTitle}>
                  {step.title}
                  {done ? (
                    <span className={styles.srOnly}>
                      {ZAPUSK_AFTER.doneLabel}
                    </span>
                  ) : null}
                </strong>
                <span className={styles.stepText}>{step.text}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
