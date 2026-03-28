/**
 * SVG-рамка смартфона в стиле последней модели iPhone.
 * Не копирует конкретный ассет — стилизована авторски.
 * viewBox подобран под пропорции 280×572 (соответствует desktop-размеру PhoneMockup).
 */
export function IPhoneFrame({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 280 572"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Тень корпуса */}
      <defs>
        <linearGradient
          id="bodyGrad"
          x1="0"
          y1="0"
          x2="280"
          y2="572"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#2a2a2e" />
          <stop offset="100%" stopColor="#1a1a1d" />
        </linearGradient>
        <linearGradient
          id="bezelGrad"
          x1="0"
          y1="0"
          x2="0"
          y2="572"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#3a3a3e" />
          <stop offset="50%" stopColor="#222225" />
          <stop offset="100%" stopColor="#3a3a3e" />
        </linearGradient>
        <linearGradient
          id="sideHighlight"
          x1="0"
          y1="0"
          x2="0"
          y2="572"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
        </linearGradient>
      </defs>

      {/* Корпус — внешний контур */}
      <rect
        x="0.5"
        y="0.5"
        width="279"
        height="571"
        rx="52"
        ry="52"
        fill="url(#bodyGrad)"
        stroke="url(#bezelGrad)"
        strokeWidth="1"
      />

      {/* Тонкая подсветка грани */}
      <rect
        x="1.5"
        y="1.5"
        width="277"
        height="569"
        rx="51"
        ry="51"
        fill="none"
        stroke="url(#sideHighlight)"
        strokeWidth="0.5"
      />

      {/* Рамка экрана — внутренний бортик */}
      <rect
        x="8"
        y="8"
        width="264"
        height="556"
        rx="44"
        ry="44"
        fill="#111113"
        stroke="#333336"
        strokeWidth="0.5"
      />

      {/* Dynamic Island */}
      <rect x="107" y="16" width="66" height="22" rx="11" fill="#111113" />
      {/* Камера внутри Dynamic Island */}
      <circle cx="152" cy="27" r="5" fill="#1a1a1d" />
      <circle cx="152" cy="27" r="3.5" fill="#0d1117" />
      <circle cx="152" cy="27" r="1.8" fill="#1e3a5f" opacity="0.6" />

      {/* Правая боковая кнопка (Power) */}
      <rect
        x="278"
        y="148"
        width="2.5"
        height="56"
        rx="1.2"
        fill="#2a2a2e"
        stroke="#3a3a3e"
        strokeWidth="0.3"
      />

      {/* Левые боковые кнопки (Volume Up / Down) */}
      <rect
        x="-0.5"
        y="132"
        width="2.5"
        height="32"
        rx="1.2"
        fill="#2a2a2e"
        stroke="#3a3a3e"
        strokeWidth="0.3"
      />
      <rect
        x="-0.5"
        y="176"
        width="2.5"
        height="32"
        rx="1.2"
        fill="#2a2a2e"
        stroke="#3a3a3e"
        strokeWidth="0.3"
      />

      {/* Переключатель звука */}
      <rect
        x="-0.5"
        y="104"
        width="2.5"
        height="18"
        rx="1.2"
        fill="#2a2a2e"
        stroke="#3a3a3e"
        strokeWidth="0.3"
      />

      {/* Полоса индикатора внизу (Home indicator) */}
      <rect
        x="98"
        y="550"
        width="84"
        height="4"
        rx="2"
        fill="#3a3a3e"
        opacity="0.5"
      />
    </svg>
  );
}
