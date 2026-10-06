import type { CSSProperties } from "react";
import { Pin } from "@/components/ui/scene-marks/scene-marks";
import styles from "./features-section.module.css";

/**
 * Живые сцены плиток «Возможностей»: линейные значки цвета плитки
 * (currentColor), без снимков экранов и подписей. Каждая крутится по кругу
 * (--cycle), пока секция на экране. Сдвиг элемента внутри круга — --d (доля
 * круга), ритм — keyframes в features-section.module.css. Без анимации
 * («уменьшить движение») сцена стоит в итоговом виде.
 */

const VIEW = "0 0 240 110";

/** Сдвиг элемента внутри круга, доля --cycle */
const at = (share: number) => ({ "--d": share }) as CSSProperties;

/** Повторные заказы без комиссии: деньги гостя целиком в кошельке, 0 % */
export function RetentionScene() {
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <g className={styles.ln}>
        <circle cx="30" cy="48" r="9" />
        <path d="M14 78 a16 14 0 0 1 32 0" />
        <rect x="132" y="40" width="80" height="54" rx="10" />
        <path d="M132 56 H212" />
        <rect x="190" y="64" width="22" height="16" rx="5" />
      </g>
      {[0, 0.18, 0.36].map((d) => (
        <g key={d} className={`${styles.ln} ${styles.coin}`} style={at(d)}>
          <circle cx="54" cy="66" r="10" />
          <path d="M54 60 V72" />
        </g>
      ))}
      <g className={styles.pulse} style={at(0.2)}>
        <rect
          x="150"
          y="8"
          width="54"
          height="24"
          rx="12"
          className={styles.solid}
        />
        <text x="177" y="25" textAnchor="middle" className={styles.badgeText}>
          0%
        </text>
      </g>
    </svg>
  );
}

/** Средний чек и возвраты: столбцы растут, тренд вверх */
export function GrowthScene() {
  const bars = [20, 32, 46, 62];
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <path d="M30 98 H214" className={styles.ln} />
      {bars.map((h, i) => (
        <rect
          key={h}
          x={52 + i * 40}
          y={98 - h}
          width="24"
          height={h}
          rx="4"
          className={`${styles.ln} ${styles.bar}`}
          style={at(i * 0.06)}
        />
      ))}
      <path
        d="M64 70 L104 58 L144 44 L184 24 M172 22 L186 23 L182 36"
        pathLength={100}
        className={`${styles.ln} ${styles.trend}`}
      />
    </svg>
  );
}

/** Вернуть уснувших: сообщение сегменту — гость «просыпается» */
export function BroadcastScene() {
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <g className={styles.ln}>
        <path d="M24 46 H40 L74 28 V88 L40 70 H24 Z" />
        <path d="M34 70 L40 90" />
        <circle cx="196" cy="46" r="11" />
        <path d="M176 82 a20 16 0 0 1 40 0" />
      </g>
      <g className={`${styles.ln} ${styles.envelope}`}>
        <rect x="90" y="46" width="38" height="26" rx="4" />
        <path d="M90 50 L109 62 L128 50" />
      </g>
      <g className={styles.zz}>
        <text x="216" y="30" className={styles.sceneText}>
          z
        </text>
        <text x="228" y="18" className={styles.sceneTextSmall}>
          z
        </text>
      </g>
      <g className={styles.popLoop}>
        <circle cx="214" cy="34" r="11" className={styles.solid} />
        <path d="M209 34 l4 4 6 -7" className={styles.onSolid} />
      </g>
    </svg>
  );
}

/** Блюдо под себя: убрать лук, добавить сыр */
export function ConstructorScene() {
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <g className={styles.ln}>
        <path d="M78 44 a42 26 0 0 1 84 0 Z" />
        <rect x="76" y="58" width="88" height="13" rx="6.5" />
        <rect x="78" y="86" width="84" height="14" rx="7" />
      </g>
      <ellipse
        cx="120"
        cy="51"
        rx="36"
        ry="3.5"
        className={`${styles.ln} ${styles.onion}`}
      />
      <path
        d="M76 76 H164 L156 84 L146 77 L136 84 L126 77 L116 84 L106 77 L96 84 L86 77 Z"
        className={`${styles.solid} ${styles.cheese}`}
      />
    </svg>
  );
}

/** Гость спрашивает — бот отвечает */
export function ChatScene() {
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <g className={styles.ln}>
        <rect x="128" y="10" width="84" height="30" rx="13" />
        <text x="170" y="32" textAnchor="middle" className={styles.sceneText}>
          ?
        </text>
      </g>
      <g className={`${styles.ln} ${styles.typing}`}>
        <rect x="28" y="52" width="58" height="26" rx="13" />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={45 + i * 12}
            cy="65"
            r="3"
            className={`${styles.solid} ${styles.dot}`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </g>
      <g className={`${styles.ln} ${styles.reply}`}>
        <rect x="28" y="52" width="132" height="46" rx="13" />
        <path d="M44 68 H140 M44 84 H112" />
      </g>
    </svg>
  );
}

/** Доставка без своего штата: машина по маршруту до метки */
export function DeliveryScene() {
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <g className={styles.ln}>
        <path d="M18 74 L38 56 L58 74 V98 H18 Z" />
        <path d="M66 98 H192" strokeDasharray="2 9" />
        <Pin x={206} y={98} />
      </g>
      <g className={`${styles.ln} ${styles.car}`}>
        <rect x="64" y="70" width="42" height="18" rx="5" />
        <path d="M72 70 V60 a3 3 0 0 1 3 -3 H94 a3 3 0 0 1 3 3 V70" />
        <circle cx="75" cy="90" r="5" />
        <circle cx="96" cy="90" r="5" />
      </g>
      <g className={styles.popLoop} style={at(0.1)}>
        <circle cx="222" cy="58" r="10" className={styles.solid} />
        <path d="M217 58 l4 4 6 -7" className={styles.onSolid} />
      </g>
    </svg>
  );
}
