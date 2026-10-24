import { HALL_SCREEN_TEXT } from "./hall-section.config";
import styles from "./hall-phone-screen.module.css";

/**
 * Статичный экран телефона: гость отсканировал QR на столе, и бот здоровается
 * «Ты за столом 12» с кнопками меню и вызова. Стоит на месте ролика «Работа с
 * залом», пока ролик не собран (см. `hall-section.config.ts`). Без анимаций —
 * это кадр продукта, а не мультфильм.
 */
export function HallPhoneScreen() {
  return (
    <div className={styles.screen} aria-hidden="true">
      <div className={styles.topBar}>
        <span className={styles.avatar}>{HALL_SCREEN_TEXT.botName[0]}</span>
        <span className={styles.who}>
          <span className={styles.name}>{HALL_SCREEN_TEXT.botName}</span>
          <span className={styles.status}>{HALL_SCREEN_TEXT.botLabel}</span>
        </span>
      </div>

      <div className={styles.chat}>
        <div className={styles.message}>
          <p className={styles.bubble}>{HALL_SCREEN_TEXT.greeting}</p>
          <div className={styles.keyboard}>
            <span className={`${styles.key} ${styles.keyMain}`}>
              {HALL_SCREEN_TEXT.menuButton}
            </span>
            <span className={styles.keyRow}>
              <span className={styles.key}>
                {HALL_SCREEN_TEXT.callWaiterButton}
              </span>
              <span className={styles.key}>
                {HALL_SCREEN_TEXT.askBillButton}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.input}>{HALL_SCREEN_TEXT.inputPlaceholder}</div>
    </div>
  );
}
