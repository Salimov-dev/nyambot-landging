/**
 * SVG-рамка экрана ноутбука в стиле MacBook Pro — только крышка, без
 * основания и клавиатуры (Руслан 06.10.2026: клавиатура отвлекала, а в
 * основании терялся низ ролика).
 *
 * Окно экрана — ровно 16:10 (552×345), как снимки и ролики кабинета
 * 1440×900: ролик ложится без обрезки ни сверху, ни снизу.
 * viewBox 560×353: окно экрана x=4 y=4 w=552 h=345.
 */
export function MacBookFrame({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 560 353"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="nb-lidGrad"
          x1="0"
          y1="0"
          x2="560"
          y2="353"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#2c2c30" />
          <stop offset="100%" stopColor="#1c1c1f" />
        </linearGradient>
        <linearGradient
          id="nb-lidEdge"
          x1="0"
          y1="0"
          x2="0"
          y2="353"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4a4a4e" />
          <stop offset="50%" stopColor="#2a2a2e" />
          <stop offset="100%" stopColor="#4a4a4e" />
        </linearGradient>
        {/* Маска: белый = видимый, чёрный = дырка для экрана */}
        <mask id="nbLidMask">
          <rect x="0" y="0" width="560" height="353" rx="12" fill="white" />
          <rect x="4" y="4" width="552" height="345" rx="6" fill="black" />
        </mask>
      </defs>

      {/* === КРЫШКА (экран) с дыркой === */}
      <rect
        x="0"
        y="0"
        width="560"
        height="353"
        rx="12"
        fill="url(#nb-lidGrad)"
        stroke="url(#nb-lidEdge)"
        strokeWidth="1.2"
        mask="url(#nbLidMask)"
      />

      {/* Подсветка грани */}
      <rect
        x="1.5"
        y="1.5"
        width="557"
        height="350"
        rx="11"
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="0.5"
      />

      {/* Внутренний край экрана */}
      <rect
        x="3"
        y="3"
        width="554"
        height="347"
        rx="7"
        fill="transparent"
        stroke="#333336"
        strokeWidth="0.5"
      />

      {/* Камера — точкой в верхней рамке, без «чёлки» поверх экрана */}
      <circle cx="280" cy="2.2" r="1.3" fill="#0d1117" />
    </svg>
  );
}
