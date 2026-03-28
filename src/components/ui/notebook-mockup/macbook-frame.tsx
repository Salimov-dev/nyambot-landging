/**
 * SVG-рамка ноутбука в стиле MacBook Pro.
 * Вид спереди, крышка открыта. Основание — трапеция,
 * начинается от краёв крышки с мягкими скруглениями в стыке.
 * viewBox 640×390.
 */
export function MacBookFrame({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 390"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="nb-lidGrad"
          x1="0"
          y1="0"
          x2="640"
          y2="350"
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
          y2="350"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4a4a4e" />
          <stop offset="50%" stopColor="#2a2a2e" />
          <stop offset="100%" stopColor="#4a4a4e" />
        </linearGradient>
        <linearGradient
          id="nb-baseGrad"
          x1="320"
          y1="350"
          x2="320"
          y2="390"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#333337" />
          <stop offset="45%" stopColor="#2a2a2e" />
          <stop offset="100%" stopColor="#2a2a2e" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="nb-hingeLine"
          x1="80"
          y1="350"
          x2="560"
          y2="350"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="transparent" />
          <stop offset="8%" stopColor="#555558" />
          <stop offset="92%" stopColor="#555558" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* === КРЫШКА (экран) === */}
      <rect
        x="40"
        y="0"
        width="560"
        height="350"
        rx="10"
        ry="10"
        fill="url(#nb-lidGrad)"
        stroke="url(#nb-lidEdge)"
        strokeWidth="1.2"
      />

      {/* Подсветка грани */}
      <rect
        x="41.5"
        y="1.5"
        width="557"
        height="347"
        rx="9"
        ry="9"
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="0.5"
      />

      {/* Внутренний экран */}
      <rect
        x="48"
        y="8"
        width="544"
        height="334"
        rx="5"
        ry="5"
        fill="#0f0f14"
        stroke="#333336"
        strokeWidth="0.5"
      />

      {/* Notch-камера */}
      <rect x="298" y="0" width="44" height="10" fill="url(#nb-lidGrad)" />
      <rect
        x="298"
        y="0"
        width="44"
        height="10"
        fill="none"
        stroke="url(#nb-lidEdge)"
        strokeWidth="0.5"
      />
      <rect x="298" y="4" width="44" height="8" rx="4" fill="url(#nb-lidGrad)" />
      <circle cx="320" cy="4.5" r="2" fill="#1a1a1d" />
      <circle cx="320" cy="4.5" r="1.2" fill="#0d1117" />
      <circle cx="320" cy="4.5" r="0.6" fill="#2d5a3f" opacity="0.5" />

      {/* === ПЕТЛЯ (шарнир) === */}
      <rect
        x="50"
        y="349.5"
        width="540"
        height="1.5"
        rx="0.75"
        fill="url(#nb-hingeLine)"
      />

      {/* === ОСНОВАНИЕ — трапеция от краёв крышки, скруглённый стык ===
          Крышка: x=40..600
          Верх основания: от 40 до 600 (совпадает с крышкой)
          Низ: от 20 до 620 (чуть шире — перспектива)
          C-кривые в верхних углах = мягкий стык с крышкой */}
      <path
        d={[
          "M 40 350",
          "Q 36 350, 24 386",
          "Q 22 390, 28 390",
          "L 612 390",
          "Q 618 390, 616 386",
          "Q 604 350, 600 350",
          "Z",
        ].join(" ")}
        fill="url(#nb-baseGrad)"
      />

      {/* Клавиатура — 2 ряда чётких + 3-й затухающий */}
      {/* Ряд 1 — Function keys */}
      <g opacity="0.5">
        {Array.from({ length: 14 }).map((_, i) => {
          const x = 96 + i * 32.5;
          const perspX = x + ((x - 320) / 320) * -1.5;
          return (
            <rect
              key={`fn-${i}`}
              x={perspX}
              y={356}
              width={27}
              height={8}
              rx={2}
              fill="#1e1e22"
              stroke="#3d3d42"
              strokeWidth="0.5"
            />
          );
        })}
      </g>
      {/* Ряд 2 — QWERTY */}
      <g opacity="0.4">
        {Array.from({ length: 13 }).map((_, i) => {
          const x = 94 + i * 35;
          const perspX = x + ((x - 320) / 320) * -2.5;
          return (
            <rect
              key={`qw-${i}`}
              x={perspX}
              y={368}
              width={29}
              height={10}
              rx={2.5}
              fill="#1e1e22"
              stroke="#3a3a3e"
              strokeWidth="0.5"
            />
          );
        })}
      </g>
      {/* Ряд 3 — затухающий */}
      <g opacity="0.15">
        {Array.from({ length: 12 }).map((_, i) => {
          const x = 100 + i * 36.5;
          const perspX = x + ((x - 320) / 320) * -3.5;
          return (
            <rect
              key={`as-${i}`}
              x={perspX}
              y={382}
              width={31}
              height={10}
              rx={2.5}
              fill="#1e1e22"
              stroke="#3a3a3e"
              strokeWidth="0.4"
            />
          );
        })}
      </g>
    </svg>
  );
}
