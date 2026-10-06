import {
  MaxMark,
  Pin,
  TelegramMark,
} from "@/components/ui/scene-marks/scene-marks";
import styles from "./killer-section.module.css";

/**
 * Картинки остановок пути заказа: линейные значки цвета карточки
 * (currentColor), без снимков экранов и без подписей.
 *
 * В покое картинка стоит в итоговом виде; у активной карточки обёртка
 * получает класс play и пересоздаётся (key) — анимации проигрываются с начала
 * и приходят к тому же итогу. Ритм — keyframes в killer-section.module.css.
 */

const VIEW = "0 0 240 120";

/** Задержка — доля длины остановки (--step): темп меняется одной переменной */
const delay = (share: number) => `calc(var(--step) * ${share})`;

/** 1. QR-код → гость выбирает MAX или Телеграм */
export function QrScene() {
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <g className={styles.line}>
        <rect x="34" y="22" width="76" height="76" rx="10" />
        <rect x="44" y="32" width="20" height="20" rx="3" />
        <rect x="80" y="32" width="20" height="20" rx="3" />
        <rect x="44" y="68" width="20" height="20" rx="3" />
        <path d="M80 68 h8 v8 M100 68 v20 h-12 M80 88 v-4" />
      </g>
      <path d="M30 26 H114" className={`${styles.line} ${styles.scan}`} />
      <path
        d="M118 48 C140 48 150 36 168 34"
        pathLength={60}
        className={`${styles.line} ${styles.wire}`}
      />
      <path
        d="M118 72 C140 72 150 84 168 86"
        pathLength={60}
        className={`${styles.line} ${styles.wire}`}
      />
      <g className={styles.pop}>
        <MaxMark x={190} y={34} size={36} />
      </g>
      <g className={styles.pop} style={{ animationDelay: delay(0.07) }}>
        <TelegramMark x={190} y={86} size={36} />
      </g>
    </svg>
  );
}

/** 2. Гость выбирает точку сети — её меню и цены */
export function NetworkScene() {
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <g className={styles.line}>
        <rect x="24" y="14" width="192" height="92" rx="14" />
      </g>
      <g className={styles.faint}>
        <path d="M24 70 L216 46 M24 36 L216 94 M92 14 L104 106 M168 14 L150 106" />
      </g>
      <g className={`${styles.line} ${styles.dim}`}>
        <Pin x={70} y={58} />
      </g>
      <g className={`${styles.line} ${styles.dim}`}>
        <Pin x={176} y={88} />
      </g>
      <circle
        cx="124"
        cy="62"
        r="16"
        className={`${styles.line} ${styles.ripple}`}
      />
      <g className={`${styles.line} ${styles.lift}`}>
        <Pin x={124} y={62} />
      </g>
    </svg>
  );
}

/** 3. Без регистрации: сразу собирает корзину */
export function CartScene() {
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <g className={styles.line}>
        <path d="M62 36 H78 L92 84 H156 L168 50 H84" />
        <circle cx="100" cy="98" r="6" />
        <circle cx="148" cy="98" r="6" />
      </g>
      <circle
        cx="112"
        cy="62"
        r="11"
        className={`${styles.line} ${styles.fall}`}
      />
      <circle
        cx="138"
        cy="64"
        r="9"
        className={`${styles.line} ${styles.fall}`}
        style={{ animationDelay: delay(0.22) }}
      />
      <g className={styles.pop} style={{ animationDelay: delay(0.04) }}>
        <circle cx="176" cy="32" r="14" className={styles.solid} />
        <text
          x="176"
          y="38"
          textAnchor="middle"
          className={`${styles.badgeText} ${styles.countOld}`}
        >
          1
        </text>
        <text
          x="176"
          y="38"
          textAnchor="middle"
          className={`${styles.badgeText} ${styles.countNew}`}
        >
          2
        </text>
      </g>
    </svg>
  );
}

/** 4. Акции и баллы: скидка к цене, баллы за заказ */
export function LoyaltyScene() {
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <g className={styles.line}>
        <rect x="40" y="30" width="112" height="60" rx="12" />
        <path d="M56 50 H120 M56 70 H100" />
      </g>
      <g className={styles.pop} style={{ animationDelay: delay(0.04) }}>
        <rect
          x="128"
          y="18"
          width="62"
          height="30"
          rx="15"
          className={styles.solid}
        />
        <text x="159" y="39" textAnchor="middle" className={styles.badgeText}>
          −10%
        </text>
      </g>
      <g
        className={`${styles.line} ${styles.pop}`}
        style={{ animationDelay: delay(0.24) }}
      >
        <path d="M184 66 l5 10 11 1.6 -8 7.8 1.9 11 -9.9 -5.2 -9.9 5.2 1.9 -11 -8 -7.8 11 -1.6z" />
        <path d="M214 62 v12 M208 68 h12" />
      </g>
    </svg>
  );
}

/** 5. Деньги за заказ — сразу на счёт заведения */
export function MoneyScene() {
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <g className={styles.line}>
        <rect x="104" y="34" width="96" height="64" rx="12" />
        <path d="M104 52 H200" />
        <rect x="176" y="62" width="24" height="18" rx="6" />
      </g>
      <g className={`${styles.line} ${styles.roll}`}>
        <circle cx="140" cy="20" r="14" />
        <path d="M140 12 V28 M135 16 h8 a3 3 0 0 1 0 6 h-8" />
      </g>
      <g className={styles.pop} style={{ animationDelay: delay(0.12) }}>
        <circle cx="142" cy="74" r="13" className={styles.solid} />
        <path d="M136 74 l4 4 8 -8" className={styles.onSolid} />
      </g>
    </svg>
  );
}

/** 6. Заказ уезжает в кассу чеком (или Нямбот ведёт его сам) */
export function PosScene() {
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <g className={styles.line}>
        <rect x="30" y="20" width="46" height="82" rx="10" />
        <path d="M46 30 H60" />
        <rect x="150" y="54" width="66" height="48" rx="8" />
        <rect x="160" y="22" width="46" height="28" rx="5" />
        <path d="M164 70 H202 M164 84 H190" />
      </g>
      <g className={`${styles.line} ${styles.slide}`}>
        <path d="M60 52 h26 v28 l-4 -3 -4 3 -5 -3 -4 3 -5 -3 -4 3 z" />
        <path d="M66 60 h14 M66 68 h10" />
      </g>
      <g className={styles.pop} style={{ animationDelay: delay(0.16) }}>
        <path d="M174 36 l5 5 11 -11" className={styles.line} />
      </g>
    </svg>
  );
}
