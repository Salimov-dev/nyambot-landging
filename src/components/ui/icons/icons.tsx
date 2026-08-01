/**
 * Минимальный набор иконок лендинга.
 *
 * Пришли на замену эмодзи в бейджах и чипах: эмодзи в B2B-интерфейсе читаются
 * как «инфобизнес» и рендерятся по-разному в разных ОС. Отдельная библиотека
 * ради шести значков не нужна — это inline-SVG на currentColor, они наследуют
 * цвет и размер текста и ничего не весят в бандле.
 */

interface IconProps {
  size?: number;
  className?: string;
}

const DEFAULT_SIZE = 18;

const baseProps = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  className,
});

export function TrendingUpIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M14 8h6v6" />
    </svg>
  );
}

export function ReceiptIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M5 3v18l2.5-1.5L10 21l2-1.5L14 21l2.5-1.5L19 21V3z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  );
}

export function HeartIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M12 20s-7-4.4-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.6-7 9-7 9z" />
    </svg>
  );
}

export function UtensilsIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M6 3v8a2 2 0 004 0V3" />
      <path d="M8 11v10" />
      <path d="M17 3c-1.7 1-2.5 2.7-2.5 5s.8 3.5 2.5 4v9" />
    </svg>
  );
}

export function MapIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}

export function MessageIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M21 12a8 8 0 01-11.4 7.2L4 21l1.8-5.6A8 8 0 1121 12z" />
    </svg>
  );
}

export function StoreIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M4 9V6l2-3h12l2 3v3a3 3 0 01-6 0 3 3 0 01-6 0 3 3 0 01-4 0z" />
      <path d="M5 11v9h14v-9" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function CheckIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function PercentIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M19 5L5 19" />
      <circle cx="7.5" cy="7.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </svg>
  );
}

export function ShieldIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M12 3l7 3v6c0 4.4-3 7.9-7 9-4-1.1-7-4.6-7-9V6z" />
      <path d="M9.5 12.5l1.8 1.8 3.4-3.6" />
    </svg>
  );
}

export function ChartIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  );
}

export function CartIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.5 12h11L21 7H6" />
    </svg>
  );
}

export function UsersIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M16 20v-1.5a4 4 0 00-4-4H7a4 4 0 00-4 4V20" />
      <circle cx="9.5" cy="7" r="3.5" />
      <path d="M21 20v-1.5a4 4 0 00-3-3.8M16 4.2a3.5 3.5 0 010 6.6" />
    </svg>
  );
}

export function TargetIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  );
}

export function ListIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}

export function MonitorIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

export function ToolsIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M14.7 6.3a4 4 0 105.1 5.1L21 21l-3-3-8.5-8.5A4 4 0 0114.7 6.3z" />
    </svg>
  );
}

export function RocketIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M13 4c4 0 7 3 7 7 0 4-4.5 7.5-7 9-2.5-1.5-7-5-7-9 0-4 3-7 7-7z" />
      <circle cx="13" cy="10" r="2" />
      <path d="M9 17l-3 4 4-1" />
    </svg>
  );
}

export function GlobeIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
    </svg>
  );
}

export function WalletIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M3 7a2 2 0 012-2h12v4" />
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M17 13h.01" />
    </svg>
  );
}

export function ChefHatIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M6 17V11a4 4 0 013-6.9A4 4 0 0117 5a4 4 0 011 6v6z" />
      <path d="M6 20h12" />
    </svg>
  );
}

export function PackageIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

export function SettingsIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </svg>
  );
}

export function FactoryIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M3 20V10l6 4V10l6 4V6h6v14z" />
      <path d="M8 20v-4M14 20v-4" />
    </svg>
  );
}

export function BoxIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M3 11h18M8 7V4h8v3" />
    </svg>
  );
}

export function BotIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <rect x="4" y="8" width="16" height="11" rx="3" />
      <path d="M12 5v3M9 13h.01M15 13h.01M9.5 16h5" />
    </svg>
  );
}

export function MegaphoneIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M4 9v6h4l8 4V5L8 9H4z" />
      <path d="M19 9.5a3.5 3.5 0 010 5" />
    </svg>
  );
}

export function CardIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 15h4" />
    </svg>
  );
}

export function GiftIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <rect x="3" y="9" width="18" height="11" rx="2" />
      <path d="M3 13h18M12 9v11" />
      <path d="M12 9c-1-3-3-4-4.5-3S6.5 9 12 9zM12 9c1-3 3-4 4.5-3S17.5 9 12 9z" />
    </svg>
  );
}

export function BulbIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 00-3.5 10.9V16h7v-2.1A6 6 0 0012 3z" />
    </svg>
  );
}

export function DocumentIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  );
}

export function LockIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 018 0v3" />
    </svg>
  );
}

export function ServerIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </svg>
  );
}

export function HandshakeIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M2 12l4-4 4 3 4-3 4 4-5 5-3-2.5L7 17z" />
    </svg>
  );
}

export function PhoneIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M6 3h4l2 5-2.5 1.5a12 12 0 005 5L16 12l5 2v4a2 2 0 01-2.2 2A17 17 0 014 5.2 2 2 0 016 3z" />
    </svg>
  );
}

export function PuzzleIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M10 4h4v2.5a2 2 0 104 0V9h2v4h-2.5a2 2 0 100 4H20v3H4v-4h2.5a2 2 0 100-4H4V9h6z" />
    </svg>
  );
}

export function ZapIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M13 2L5 13h6l-1 9 8-11h-6z" />
    </svg>
  );
}

export function HandIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M8 12V5a1.5 1.5 0 013 0v6M11 11V4a1.5 1.5 0 013 0v7M14 11V6a1.5 1.5 0 013 0v8a7 7 0 01-7 7h-1a6 6 0 01-6-6v-3a1.5 1.5 0 013 0" />
    </svg>
  );
}

/** Медаль — статус участника проекта «Сколково» */
export function AwardIcon({ size = DEFAULT_SIZE, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14.5L7 22l5-3 5 3-1.5-7.5" />
    </svg>
  );
}
