import {
  Cylinder,
  MaxMark,
  Pin,
  TelegramMark,
} from "@/components/ui/scene-marks/scene-marks";
import styles from "./compare-section.module.css";

/**
 * Картинки пар «обычно → у нас»: линейные значки, без снимков экранов.
 * Каждая сцена за --scene (4,7 с) переходит из состояния «обычно» (серое,
 * классы u*) в «у нас» (оранжевое, классы o*); ритм задают keyframes в
 * compare-section.module.css, сцена перезапускается сменой key у обёртки.
 * Подписей внутри нет — только значки, иначе 6 переводов.
 */

const VIEW = "0 0 360 200";

/** 1. Отдельный бот и отдельная база на каждый мессенджер → одна система */
export function OneBotScene() {
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <MaxMark x={56} y={56} />
      <TelegramMark x={56} y={144} />
      <g className={`${styles.gray} ${styles.uFade}`}>
        <path d="M86 56 H226" strokeDasharray="6 7" />
        <path d="M86 144 H226" strokeDasharray="6 7" />
      </g>
      <g className={`${styles.gray} ${styles.uMergeDown}`}>
        <Cylinder x={270} y={56} />
      </g>
      <g className={`${styles.gray} ${styles.uMergeUp}`}>
        <Cylinder x={270} y={144} />
      </g>
      <g className={`${styles.accent} ${styles.oIn}`}>
        <path d="M86 56 C150 56 170 100 228 100" />
        <path d="M86 144 C150 144 170 100 228 100" />
        <Cylinder x={262} y={100} w={64} h={58} />
        {/* Что общее: гости, заказы, баллы */}
        <circle cx="322" cy="62" r="5" />
        <path d="M312 80 a10 8 0 0 1 20 0" />
        <rect x="313" y="92" width="18" height="20" rx="3" />
        <path d="M317 99 H327 M317 105 H324" />
        <path d="M322 124 l3.5 7 7.5 1 -5.5 5.2 1.3 7.6 -6.8 -3.6 -6.8 3.6 1.3 -7.6 -5.5 -5.2 7.5 -1z" />
      </g>
    </svg>
  );
}

/** 2. Новая точка — новый бот → вторая метка в том же кабинете */
export function NewPointScene() {
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <g className={`${styles.gray} ${styles.uFade}`}>
        <circle cx="120" cy="100" r="34" />
        <circle cx="108" cy="94" r="3" />
        <circle cx="132" cy="94" r="3" />
        <path d="M108 110 Q120 118 132 110" />
      </g>
      <g className={`${styles.gray} ${styles.uSlideIn}`}>
        <circle cx="240" cy="100" r="34" />
        <path d="M240 84 V116 M224 100 H256" />
      </g>
      <g className={`${styles.accent} ${styles.oIn}`}>
        <rect x="70" y="28" width="220" height="144" rx="16" />
        <path d="M70 54 H290" />
        <circle cx="86" cy="41" r="3" />
        <circle cx="98" cy="41" r="3" />
        <g className={styles.faint}>
          <path d="M90 80 L270 110 M90 130 L270 70 M150 54 L170 172 M230 54 L215 172" />
        </g>
        <Pin x={150} y={112} />
      </g>
      <g className={`${styles.accent} ${styles.oDrop}`}>
        <Pin x={228} y={132} />
      </g>
    </svg>
  );
}

/** 3. Регистрация на входе → сразу меню */
export function NoSignupScene() {
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <g className={styles.neutral}>
        <rect x="128" y="10" width="104" height="180" rx="18" />
        <path d="M166 22 H194" />
      </g>
      <g className={`${styles.gray} ${styles.uFade}`}>
        <circle cx="180" cy="52" r="10" />
        <rect x="144" y="74" width="72" height="16" rx="5" />
        <rect x="144" y="98" width="72" height="16" rx="5" />
        <rect x="144" y="122" width="72" height="16" rx="5" />
        <rect
          x="144"
          y="150"
          width="72"
          height="22"
          rx="8"
          className={styles.grayFill}
        />
      </g>
      {[0, 1, 2].map((i) => (
        <g
          key={i}
          className={`${styles.accent} ${styles.oIn}`}
          style={{ animationDelay: `${i * 0.12}s` }}
        >
          <rect x="142" y={38 + i * 48} width="76" height="40" rx="8" />
          <circle cx="160" cy={58 + i * 48} r="9" />
          <path d={`M176 ${52 + i * 48} H208 M176 ${64 + i * 48} H196`} />
        </g>
      ))}
    </svg>
  );
}

/** 4. Задача разработчикам сервиса → переключатель в кабинете */
export function SetupScene() {
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <g className={`${styles.gray} ${styles.uFade}`}>
        <rect x="86" y="36" width="188" height="128" rx="14" />
        <path d="M118 74 H146 L126 100 L146 126 H118 L138 100 Z" />
        <path d="M168 78 H248 M168 100 H236 M168 122 H220" />
      </g>
      <g className={`${styles.accent} ${styles.oIn}`}>
        <rect x="86" y="36" width="188" height="128" rx="14" />
        <path d="M108 68 H176 M108 100 H190 M108 132 H168" />
        <rect
          x="214"
          y="58"
          width="40"
          height="20"
          rx="10"
          className={styles.accentFill}
        />
        <circle cx="244" cy="68" r="7" className={styles.knobOn} />
        <rect
          x="214"
          y="122"
          width="40"
          height="20"
          rx="10"
          className={styles.accentFill}
        />
        <circle cx="244" cy="132" r="7" className={styles.knobOn} />
        {/* Средний щёлкает во «вкл» уже на глазах */}
        <rect
          x="214"
          y="90"
          width="40"
          height="20"
          rx="10"
          className={styles.trackFlip}
        />
        <circle cx="224" cy="100" r="7" className={styles.knobFlip} />
      </g>
    </svg>
  );
}

/** 5. Цена на созвоне → открытая цена и 30 дней бесплатно */
export function PricesScene() {
  return (
    <svg viewBox={VIEW} className={styles.scene} aria-hidden="true">
      <g className={`${styles.gray} ${styles.uFade}`}>
        <path d="M112 70 c-6 6 -6 18 6 34 12 16 26 24 34 20 l8 -8 -14 -14 -8 6 c-6 -2 -14 -10 -16 -16 l6 -8 -14 -14 z" />
        <path d="M196 52 h76 a10 10 0 0 1 10 10 v36 a10 10 0 0 1 -10 10 h-50 l-16 14 v-14 h-10 a10 10 0 0 1 -10 -10 v-36 a10 10 0 0 1 10 -10 z" />
        <text x="234" y="94" textAnchor="middle" className={styles.grayText}>
          ?
        </text>
      </g>
      <g className={`${styles.accent} ${styles.oIn}`}>
        <path d="M84 100 L124 60 H176 V112 L136 152 Z" />
        <circle cx="160" cy="76" r="6" />
        <path d="M118 104 l12 12 22 -24" />
        <rect x="206" y="62" width="84" height="80" rx="12" />
        <path d="M206 84 H290 M228 54 V70 M268 54 V70" />
        <text x="248" y="126" textAnchor="middle" className={styles.accentText}>
          30
        </text>
      </g>
    </svg>
  );
}

export const COMPARE_SCENES = [
  OneBotScene,
  NewPointScene,
  NoSignupScene,
  SetupScene,
  PricesScene,
] as const;
