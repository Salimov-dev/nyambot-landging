import { useId } from "react";

/**
 * Общие значки для SVG-сцен лендинга («Сравнение», «Что это даёт заведению»):
 * группы <g> для вставки в чужой <svg>, координаты — центр значка.
 * Цвет меток и баз — от родителя (stroke), мессенджеры — в своих цветах.
 */

/** Значок MAX: скруглённый квадрат с кольцом-чатом, как на странице QR-кода */
export function MaxMark({
  x,
  y,
  size = 44,
}: {
  x: number;
  y: number;
  size?: number;
}) {
  // Свой id градиента у каждого значка: на странице их несколько
  const gradient = useId();
  return (
    <g
      transform={`translate(${x - size / 2} ${y - size / 2}) scale(${size / 44})`}
    >
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b8def" />
          <stop offset="1" stopColor="#9b4fd9" />
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="12" fill={`url(#${gradient})`} />
      <circle cx="22" cy="21" r="9" fill="none" stroke="#fff" strokeWidth="4" />
      <path d="M15 29 L13 34 L19 31" fill="#fff" />
    </g>
  );
}

/** Значок Телеграма: круг с бумажным самолётиком */
export function TelegramMark({
  x,
  y,
  size = 44,
}: {
  x: number;
  y: number;
  size?: number;
}) {
  return (
    <g
      transform={`translate(${x - size / 2} ${y - size / 2}) scale(${size / 44})`}
    >
      <circle cx="22" cy="22" r="22" fill="#229ed9" />
      <path
        d="M10 21.5 L32 13 L28.5 31 L21.5 26 L18 30 L18 24.5 L28 16 L16 23 Z"
        fill="#fff"
      />
    </g>
  );
}

/** База данных — цилиндр */
export function Cylinder({
  x,
  y,
  w = 56,
  h = 46,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
}) {
  const rx = w / 2;
  const ry = 9;
  return (
    <g transform={`translate(${x - rx} ${y - h / 2})`}>
      <path
        d={`M0 ${ry} V${h - ry} A${rx} ${ry} 0 0 0 ${w} ${h - ry} V${ry}`}
      />
      <ellipse cx={rx} cy={ry} rx={rx} ry={ry} />
      <path d={`M0 ${h / 2} A${rx} ${ry} 0 0 0 ${w} ${h / 2}`} />
    </g>
  );
}

/** Метка на карте, (x, y) — кончик */
export function Pin({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 11} ${y - 30})`}>
      <path d="M11 1C5.5 1 1 5.4 1 11c0 7.5 10 19 10 19s10-11.5 10-19C21 5.4 16.5 1 11 1z" />
      <circle cx="11" cy="11" r="3.5" />
    </g>
  );
}
