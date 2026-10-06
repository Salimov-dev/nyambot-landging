import type { CSSProperties } from "react";
import {
  Cylinder,
  MaxMark,
  TelegramMark,
} from "@/components/ui/scene-marks/scene-marks";
import s from "./page-scenes.module.css";

/**
 * Сцены карточек подстраниц, которых нет среди сцен главной (Руслан
 * 06.10.2026: «не во всех плитках есть анимации — так на каждой странице»).
 * Каждая — про смысл своей карточки, в одном стиле со сценами главной:
 * линии цвета карточки, петля --cycle, без подписей (иначе 6 переводов).
 */

const VIEW = "0 0 240 110";

/** Сдвиг внутри круга (доля) и смещения движения */
const v = (d: number, dx?: number, dy?: number) =>
  ({
    "--d": d,
    ...(dx === undefined ? {} : { "--dx": `${dx}px` }),
    ...(dy === undefined ? {} : { "--dy": `${dy}px` }),
  }) as CSSProperties;

const cx = (...names: string[]) => names.join(" ");

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox={VIEW} className={s.scene} aria-hidden="true">
      {children}
    </svg>
  );
}

/** Касса и телефон с меню */
function Pos({ x = 20 }: { x?: number }) {
  return (
    <g className={s.ln}>
      <rect x={x} y="46" width="66" height="44" rx="7" />
      <rect x={x + 9} y="22" width="48" height="24" rx="4" />
      <path d={`M${x + 14} 62 H${x + 50} M${x + 14} 74 H${x + 40}`} />
    </g>
  );
}

function Phone({ x, y = 8, h = 94 }: { x: number; y?: number; h?: number }) {
  return (
    <g className={s.ln}>
      <rect x={x} y={y} width="54" height={h} rx="10" />
      <path d={`M${x + 20} ${y + 9} H${x + 34}`} />
    </g>
  );
}

function Check({
  x,
  y,
  r = 11,
  d = 0,
  cls = s.pop,
}: {
  x: number;
  y: number;
  r?: number;
  d?: number;
  cls?: string;
}) {
  return (
    <g className={cls} style={v(d)}>
      <circle cx={x} cy={y} r={r} className={s.solid} />
      <path
        d={`M${x - r * 0.45} ${y} l${r * 0.35} ${r * 0.35} ${r * 0.6} -${r * 0.65}`}
        className={s.onSolid}
      />
    </g>
  );
}

function Person({ x, y, r = 8 }: { x: number; y: number; r?: number }) {
  return (
    <g className={s.ln}>
      <circle cx={x} cy={y} r={r} />
      <path
        d={`M${x - r * 1.8} ${y + r * 3.2} a${r * 1.8} ${r * 1.6} 0 0 1 ${r * 3.6} 0`}
      />
    </g>
  );
}

function Store({ x, y }: { x: number; y: number }) {
  return (
    <g className={s.ln}>
      <path d={`M${x - 16} ${y} L${x} ${y - 13} L${x + 16} ${y}`} />
      <rect x={x - 13} y={y} width="26" height="20" rx="3" />
    </g>
  );
}

function QrMini({ x, y, size = 64 }: { x: number; y: number; size?: number }) {
  const k = size / 64;
  return (
    <g className={s.ln} transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x="0" y="0" width="64" height="64" rx="9" />
      <rect x="8" y="8" width="16" height="16" rx="3" />
      <rect x="40" y="8" width="16" height="16" rx="3" />
      <rect x="8" y="40" width="16" height="16" rx="3" />
      <path d="M40 40 h7 v7 M56 40 v16 h-9" />
    </g>
  );
}

/* ----- Касса и меню ----- */

/** Меню и стоп-лист уезжают из кассы в бот */
export function SyncScene() {
  return (
    <Svg>
      <Pos />
      <Phone x={164} />
      <path d="M174 34 H208 M174 56 H208 M174 78 H202" className={s.ln} />
      {[0, 0.14].map((d) => (
        <rect
          key={d}
          x="94"
          y="58"
          width="16"
          height="11"
          rx="2"
          className={cx(s.ln, s.travel)}
          style={v(d, 52, 0)}
        />
      ))}
      <path
        d="M170 56 H212"
        pathLength={100}
        className={cx(s.ln, s.draw)}
        style={v(0.25)}
      />
    </Svg>
  );
}

/** Кассы нет — меню ведётся в кабинете Нямбота */
export function MenuEditScene() {
  return (
    <Svg>
      <g className={s.ln}>
        <rect x="36" y="12" width="168" height="88" rx="10" />
        <path d="M36 30 H204" />
        <path d="M54 48 H140 M54 66 H124" />
      </g>
      <path
        d="M54 84 H150"
        className={cx(s.ln, s.appear)}
        style={v(0.1, -10, 0)}
      />
      <g className={cx(s.ln, s.travel)} style={v(0, 78, 40)}>
        <path d="M96 22 l14 -14 6 6 -14 14 -8 2 z" />
      </g>
      <Check x={180} y={74} d={0.2} />
    </Svg>
  );
}

/** Статусы заказа сами приходят гостю */
export function StatusScene() {
  return (
    <Svg>
      <Phone x={70} y={6} h={98} />
      {[0, 0.16, 0.32].map((d, i) => (
        <g key={d} className={s.appear} style={v(d, 0, 6)}>
          <rect
            x="82"
            y={26 + i * 24}
            width="64"
            height="18"
            rx="9"
            className={s.ln}
          />
          <circle cx="92" cy={35 + i * 24} r="4" className={s.solid} />
        </g>
      ))}
      <Check x={176} y={30} d={0.4} />
    </Svg>
  );
}

/* ----- Кабинет, команда ----- */

/** Кабинет: заказ приходит строкой и получает статус */
export function DashboardScene() {
  return (
    <Svg>
      <g className={s.ln}>
        <rect x="30" y="10" width="180" height="90" rx="10" />
        <path d="M30 28 H210" />
        <path d="M48 64 H150 M48 84 H134" />
      </g>
      <g className={s.appear} style={v(0, 0, -10)}>
        <rect x="42" y="36" width="156" height="18" rx="5" className={s.ln} />
        <circle cx="54" cy="45" r="4" className={s.solid} />
      </g>
      <Check x={184} y={45} r={8} d={0.18} />
    </Svg>
  );
}

/** Команда: телефон, планшет, ноутбук — у каждого свой экран */
export function TeamScene() {
  return (
    <Svg>
      <Phone x={18} y={26} h={70} />
      <g className={s.ln}>
        <rect x="88" y="22" width="66" height="78" rx="8" />
        <rect x="166" y="34" width="58" height="42" rx="5" />
        <path d="M160 82 H230" />
      </g>
      <Check x={45} y={60} r={9} d={0} />
      <Check x={121} y={60} r={9} d={0.12} />
      <Check x={195} y={55} r={9} d={0.24} />
    </Svg>
  );
}

/** Повар: заказ на кухонном экране, «Готов» */
export function KitchenScene() {
  return (
    <Svg>
      <g className={s.ln}>
        <rect x="66" y="8" width="108" height="94" rx="10" />
        <path d="M80 28 H140 M80 44 H156 M80 60 H130" />
      </g>
      <rect
        x="80"
        y="72"
        width="80"
        height="20"
        rx="6"
        className={cx(s.ln, s.tint)}
        style={v(0.1)}
      />
      <Check x={184} y={20} d={0.2} />
    </Svg>
  );
}

/** Свои курьеры: курьер с сумкой идёт к гостю */
export function CourierScene() {
  return (
    <Svg>
      <g className={s.ln}>
        <path d="M188 58 L206 42 L224 58 V90 H188 Z" />
        <path d="M24 92 H186" strokeDasharray="2 9" />
      </g>
      <g className={cx(s.ln, s.travel)} style={v(0, 128, 0)}>
        <circle cx="40" cy="44" r="7" />
        <path d="M40 52 V72 M40 72 l-8 18 M40 72 l8 18 M40 58 l-10 8" />
        <rect x="46" y="54" width="16" height="16" rx="3" />
      </g>
      <Check x={226} y={30} r={9} d={0.18} />
    </Svg>
  );
}

/** Сбой — администратору приходит уведомление */
export function AlertScene() {
  return (
    <Svg>
      <g className={cx(s.ln, s.wiggle)} style={v(0)}>
        <path d="M44 72 V52 a20 20 0 0 1 40 0 V72 l6 8 H38 Z" />
        <path d="M58 86 a6 6 0 0 0 12 0" />
      </g>
      <g className={s.appear} style={v(0.04, 16, 0)}>
        <rect x="110" y="34" width="110" height="42" rx="12" className={s.ln} />
        <path d="M150 50 H204 M150 62 H186" className={s.ln} />
        <circle cx="130" cy="55" r="10" className={s.solid} />
        <text x="130" y="61" textAnchor="middle" className={s.glyph}>
          !
        </text>
      </g>
    </Svg>
  );
}

/** Что гости ищут и не находят: «нет» → блюдо добавлено */
export function SearchScene() {
  return (
    <Svg>
      <g className={s.ln}>
        <rect x="30" y="16" width="180" height="30" rx="15" />
        <circle cx="50" cy="31" r="7" />
        <path d="M55 36 l6 6" />
        <rect x="30" y="58" width="180" height="40" rx="10" />
      </g>
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={74 + i * 12}
          cy="31"
          r="3"
          className={cx(s.solid, s.pulse)}
          style={v(i * 0.1)}
        />
      ))}
      <g className={cx(s.ln, s.early)} style={v(0)}>
        <circle cx="120" cy="78" r="11" />
        <path d="M112 86 L128 70" />
      </g>
      <g className={s.late} style={v(0)}>
        <path d="M64 78 H150" className={s.ln} />
        <circle cx="180" cy="78" r="11" className={s.solid} />
        <path d="M180 72 V84 M174 78 H186" className={s.onSolid} />
      </g>
    </Svg>
  );
}

/* ----- Сеть, доступ ----- */

/** Права по людям: у каждого свой переключатель */
export function AccessScene() {
  return (
    <Svg>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <g className={s.ln}>
            <circle cx="60" cy={22 + i * 32} r="7" />
            <path d={`M76 ${22 + i * 32} H140`} />
            <rect x="160" y={13 + i * 32} width="40" height="18" rx="9" />
          </g>
          {i === 1 ? (
            <circle cx="169" cy={22 + i * 32} r="6" className={s.solid} />
          ) : (
            <circle
              cx="169"
              cy={22 + i * 32}
              r="6"
              className={cx(s.solid, s.flip)}
              style={v(i * 0.12, 22)}
            />
          )}
        </g>
      ))}
    </Svg>
  );
}

/** Франшиза и сеть: головной офис ведёт вывеску всех точек */
export function FranchiseScene() {
  const points = [50, 120, 190];
  return (
    <Svg>
      <g className={s.ln}>
        <rect x="100" y="6" width="40" height="28" rx="6" />
        <path d="M112 16 H128 M112 24 H122" />
      </g>
      <path
        d="M120 34 L50 72 M120 34 V72 M120 34 L190 72"
        className={s.faint}
      />
      {points.map((x) => (
        <Store key={x} x={x} y={84} />
      ))}
      {points.map((x, i) => (
        <circle
          key={x}
          cx="120"
          cy="36"
          r="5"
          className={cx(s.solid, s.travel)}
          style={v(i * 0.1, x - 120, 34)}
        />
      ))}
    </Svg>
  );
}

/* ----- Сайт, страница выбора, QR ----- */

/** Сайт остаётся — мессенджеры встают рядом */
export function SiteScene() {
  return (
    <Svg>
      <g className={s.ln}>
        <rect x="20" y="14" width="120" height="82" rx="9" />
        <path d="M20 32 H140" />
        <circle cx="32" cy="23" r="2" />
        <circle cx="42" cy="23" r="2" />
        <path d="M36 50 H112 M36 66 H96 M36 82 H104" />
      </g>
      <MaxMark x={182} y={34} size={36} />
      <TelegramMark x={182} y={78} size={36} />
      <path
        d="M144 34 H160 M144 78 H160"
        pathLength={100}
        className={cx(s.ln, s.draw)}
        style={v(0)}
      />
      <Check x={128} y={20} r={9} d={0.2} />
    </Svg>
  );
}

/** Страница выбора: мессенджеры, а под ними сайт и приложения */
export function ChooserScene() {
  return (
    <Svg>
      <Phone x={93} y={4} h={102} />
      <MaxMark x={120} y={34} size={26} />
      <TelegramMark x={120} y={62} size={26} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={98 + i * 16}
          y="82"
          width="12"
          height="12"
          rx="3"
          className={cx(s.ln, s.appear)}
          style={v(0.08 + i * 0.08, 0, 6)}
        />
      ))}
    </Svg>
  );
}

/** Код на своём домене: QR → ссылка → свой сайт */
export function DomainScene() {
  return (
    <Svg>
      <QrMini x={24} y={22} size={66} />
      <path
        d="M100 55 H150"
        pathLength={100}
        className={cx(s.ln, s.draw)}
        style={v(0)}
      />
      <g className={s.ln}>
        <circle cx="184" cy="55" r="28" />
        <path d="M156 55 H212 M184 27 a16 28 0 0 1 0 56 M184 27 a16 28 0 0 0 0 56" />
      </g>
      <Check x={210} y={30} r={10} d={0.2} />
    </Svg>
  );
}

/** Что выбирают гости: MAX и Телеграм, столбцы растут */
export function ChoiceStatsScene() {
  return (
    <Svg>
      <path d="M50 100 H190" className={s.ln} />
      <rect
        x="78"
        y="40"
        width="30"
        height="58"
        rx="5"
        className={cx(s.ln, s.grow)}
        style={v(0)}
      />
      <rect
        x="132"
        y="58"
        width="30"
        height="40"
        rx="5"
        className={cx(s.ln, s.grow)}
        style={v(0.08)}
      />
      <MaxMark x={93} y={22} size={26} />
      <TelegramMark x={147} y={40} size={26} />
    </Svg>
  );
}

/** Сменил бота — код тот же */
export function SwapBotScene() {
  return (
    <Svg>
      <QrMini x={22} y={22} size={66} />
      <path d="M100 55 H132" className={s.faint} />
      <g className={cx(s.ln, s.vanish)} style={v(0, 30, 0)}>
        <circle cx="168" cy="55" r="24" />
        <circle cx="160" cy="50" r="3" />
        <circle cx="176" cy="50" r="3" />
      </g>
      <g className={cx(s.ln, s.appear)} style={v(0.08, -30, 0)}>
        <rect x="144" y="31" width="48" height="48" rx="12" />
        <circle cx="160" cy="52" r="3" />
        <circle cx="176" cy="52" r="3" />
        <path d="M160 64 Q168 70 176 64" />
      </g>
      <Check x={88} y={20} r={9} d={0.18} />
    </Svg>
  );
}

/** Файлы для печати: лист с кодом выходит из принтера */
export function PrintScene() {
  return (
    <Svg>
      <g className={s.ln}>
        <rect x="70" y="34" width="100" height="40" rx="8" />
        <rect x="88" y="8" width="64" height="26" rx="3" />
        <circle cx="154" cy="48" r="3" />
      </g>
      <g className={s.appear} style={v(0, 0, -24)}>
        <rect x="90" y="62" width="60" height="44" rx="3" className={s.ln} />
        <QrMini x={106} y={68} size={28} />
      </g>
    </Svg>
  );
}

/** Лого в центре кода */
export function QrLogoScene() {
  return (
    <Svg>
      <QrMini x={78} y={8} size={94} />
      <g className={s.pop} style={v(0)}>
        <circle cx="125" cy="55" r="15" className={s.solid} />
        <circle cx="125" cy="55" r="7" className={s.onSolid} />
      </g>
    </Svg>
  );
}

/* ----- Брендирование ----- */

/** Витрина в цветах заведения: шапка и кнопка перекрашиваются */
export function BrandScene() {
  const tints = ["#4dabf7", "#51cf66"];
  return (
    <Svg>
      <Phone x={93} y={4} h={102} />
      <rect x="101" y="22" width="38" height="16" rx="4" className={s.solid} />
      <rect x="101" y="80" width="38" height="14" rx="7" className={s.solid} />
      {tints.map((fill, i) => (
        <g key={fill} className={s.third} style={v((i + 1) / 3)}>
          <rect x="101" y="22" width="38" height="16" rx="4" style={{ fill }} />
          <rect x="101" y="80" width="38" height="14" rx="7" style={{ fill }} />
        </g>
      ))}
      <path d="M103 50 H137 M103 62 H129" className={s.faint} />
    </Svg>
  );
}

/** Что остаётся прежним: вёрстка та же, меняется только цвет */
export function KeepScene() {
  return (
    <Svg>
      <Phone x={78} y={4} h={102} />
      <path d="M88 30 H122 M88 50 H118 M88 70 H122" className={s.ln} />
      <rect
        x="88"
        y="82"
        width="34"
        height="12"
        rx="6"
        className={cx(s.ln, s.tint)}
        style={v(0)}
      />
      {[0, 1, 2].map((i) => (
        <Check key={i} x={160} y={30 + i * 20} r={8} d={0.08 + i * 0.1} />
      ))}
    </Svg>
  );
}

/** Готовые схемы или свой цвет: выбор кольцом */
export function PaletteScene() {
  const colors = ["#ff6b4a", "#4dabf7", "#51cf66", "#be4bdb"];
  return (
    <Svg>
      {colors.map((fill, i) => (
        <circle key={fill} cx={57 + i * 42} cy="55" r="15" style={{ fill }} />
      ))}
      <circle
        cx="57"
        cy="55"
        r="22"
        className={cx(s.ln, s.steps)}
        style={v(0, 42)}
      />
    </Svg>
  );
}

/* ----- Данные и безопасность ----- */

/** Данные принадлежат заведению: база под замком */
export function DataOwnScene() {
  return (
    <Svg>
      <g className={s.ln}>
        <Cylinder x={110} y={58} w={70} h={64} />
      </g>
      {[0, 0.12].map((d) => (
        <circle
          key={d}
          cx="36"
          cy="40"
          r="6"
          className={cx(s.solid, s.travel)}
          style={v(d, 56, 14)}
        />
      ))}
      <g className={s.pop} style={v(0.22)}>
        <rect
          x="164"
          y="54"
          width="34"
          height="28"
          rx="6"
          className={s.solid}
        />
        <path d="M171 54 v-8 a10 10 0 0 1 20 0 v8" className={s.ln} />
      </g>
    </Svg>
  );
}

/** Кому данные уходят: касса, доставка, оплата — и больше никому */
export function ShareScene() {
  const targets = [
    { x: 196, y: 20 },
    { x: 206, y: 55 },
    { x: 196, y: 90 },
  ];
  return (
    <Svg>
      <g className={s.ln}>
        <Cylinder x={50} y={55} w={52} h={50} />
      </g>
      {targets.map((t) => (
        <g key={t.y}>
          <path d={`M80 55 L${t.x - 16} ${t.y}`} className={s.faint} />
          <rect
            x={t.x - 12}
            y={t.y - 10}
            width="24"
            height="20"
            rx="5"
            className={s.ln}
          />
        </g>
      ))}
      {targets.map((t, i) => (
        <circle
          key={t.y}
          cx="80"
          cy="55"
          r="5"
          className={cx(s.solid, s.travel)}
          style={v(i * 0.1, t.x - 96, t.y - 55)}
        />
      ))}
    </Svg>
  );
}

/** Хранение и передача: данные проходят через защиту */
export function SecureScene() {
  return (
    <Svg>
      <g className={s.ln}>
        <path d="M120 10 L156 22 V52 C156 76 140 92 120 100 C100 92 84 76 84 52 V22 Z" />
      </g>
      <path
        d="M104 54 L116 66 L138 42"
        pathLength={100}
        className={cx(s.ln, s.draw)}
        style={v(0.2)}
      />
      {[0, 0.14].map((d) => (
        <rect
          key={d}
          x="20"
          y="50"
          width="14"
          height="10"
          rx="2"
          className={cx(s.ln, s.travel)}
          style={v(d, 186, 0)}
        />
      ))}
    </Svg>
  );
}

/** Минимум данных, удаление по запросу */
export function EraseScene() {
  return (
    <Svg>
      <g className={s.ln}>
        <rect x="40" y="10" width="120" height="90" rx="10" />
        <path d="M58 30 H140" />
      </g>
      <path
        d="M58 52 H130"
        className={cx(s.ln, s.vanish)}
        style={v(0, 20, 0)}
      />
      <path
        d="M58 74 H120"
        className={cx(s.ln, s.vanish)}
        style={v(0.1, 20, 0)}
      />
      <g className={cx(s.ln, s.pop)} style={v(0.2)}>
        <path d="M180 40 H214 M188 40 V34 H206 V40 M184 40 L188 84 H206 L210 40" />
        <path d="M194 52 V74 M200 52 V74" />
      </g>
    </Svg>
  );
}

/** Российская разработка: свои серверы */
export function ServerScene() {
  return (
    <Svg>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <g className={s.ln}>
            <rect x="64" y={10 + i * 32} width="112" height="26" rx="6" />
            <path d={`M80 ${23 + i * 32} H120`} />
          </g>
          <circle
            cx="156"
            cy={23 + i * 32}
            r="4"
            className={cx(s.solid, s.pulse)}
            style={v(i * 0.2)}
          />
        </g>
      ))}
    </Svg>
  );
}

/* ----- Лояльность ----- */

/** Акции по дням и часам: стрелка доходит до часа акции */
export function ClockScene() {
  return (
    <Svg>
      <g className={s.ln}>
        <circle cx="100" cy="55" r="40" />
        <path d="M100 55 V30" />
      </g>
      <path
        d="M100 15 A40 40 0 0 1 140 55"
        className={s.faint}
        style={{ strokeWidth: 8, opacity: 0.45 }}
      />
      <path
        d="M100 55 L126 55"
        className={cx(s.ln, s.spin)}
        style={{ transformBox: "view-box", transformOrigin: "100px 55px" }}
      />
      <g className={s.pop} style={v(0.1)}>
        <rect
          x="156"
          y="20"
          width="58"
          height="30"
          rx="15"
          className={s.solid}
        />
        <text x="185" y="41" textAnchor="middle" className={s.glyph}>
          %
        </text>
      </g>
    </Svg>
  );
}

/** Промокод: гость вводит код — скидка */
export function PromoCodeScene() {
  return (
    <Svg>
      <rect x="28" y="38" width="130" height="34" rx="10" className={s.ln} />
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={50 + i * 18}
          cy="55"
          r="4"
          className={cx(s.solid, s.appear)}
          style={v(i * 0.06, 0, 0)}
        />
      ))}
      <g className={s.pop} style={v(0.25)}>
        <rect
          x="168"
          y="38"
          width="52"
          height="34"
          rx="17"
          className={s.solid}
        />
        <text x="194" y="61" textAnchor="middle" className={s.glyph}>
          −%
        </text>
      </g>
    </Svg>
  );
}

/** Подарки и предложение дня: коробка открывается */
export function GiftScene() {
  return (
    <Svg>
      <g className={s.ln}>
        <rect x="88" y="50" width="64" height="46" rx="5" />
        <path d="M120 50 V96" />
      </g>
      <g className={cx(s.ln, s.vanish)} style={v(0, 0, -16)}>
        <rect x="82" y="36" width="76" height="16" rx="4" />
        <path d="M120 36 c-10 -16 -24 -4 0 0 c10 -16 24 -4 0 0" />
      </g>
      <g className={cx(s.ln, s.pop)} style={v(0.08)}>
        <path d="M120 6 l4.5 9 10 1.5 -7.2 7 1.7 9.9 -9 -4.7 -9 4.7 1.7 -9.9 -7.2 -7 10 -1.5z" />
      </g>
    </Svg>
  );
}

/** Скидка на первый заказ */
export function FirstOrderScene() {
  return (
    <Svg>
      <Person x={78} y={40} r={12} />
      <g className={s.pop} style={v(0)}>
        <circle cx="104" cy="26" r="12" className={s.solid} />
        <text x="104" y="32" textAnchor="middle" className={s.glyph}>
          1
        </text>
      </g>
      <g className={s.pop} style={v(0.14)}>
        <path d="M134 48 L154 28 H190 V64 L170 84 Z" className={s.ln} />
        <circle cx="176" cy="42" r="4" className={s.solid} />
        <text x="160" y="68" textAnchor="middle" className={s.glyphLine}>
          %
        </text>
      </g>
    </Svg>
  );
}

/* ----- Ещё сцены: на странице ни одна не повторяется (Руслан 06.10.2026) —
   ни между карточками, ни с секциями главной под ответом ----- */

/** Заказ из бота встаёт строкой в список кассы */
export function OrderInScene() {
  return (
    <Svg>
      <Phone x={16} y={10} h={90} />
      <path d="M26 40 H60 M26 56 H54" className={s.ln} />
      <g className={s.ln}>
        <rect x="112" y="16" width="112" height="78" rx="9" />
        <path d="M126 58 H210 M126 76 H196" />
      </g>
      <rect
        x="76"
        y="34"
        width="16"
        height="11"
        rx="2"
        className={cx(s.ln, s.travel)}
        style={v(0, 46, 0)}
      />
      <g className={s.appear} style={v(0.12, 0, -8)}>
        <rect x="122" y="28" width="92" height="18" rx="5" className={s.ln} />
        <circle cx="132" cy="37" r="4" className={s.solid} />
      </g>
    </Svg>
  );
}

/** Акции считает сама касса: цена в кассе перечёркивается, скидка */
export function PosPromoScene() {
  return (
    <Svg>
      <Pos x={30} />
      <path
        d="M44 62 H80"
        pathLength={100}
        className={cx(s.ln, s.draw)}
        style={v(0)}
      />
      <g className={s.pop} style={v(0.12)}>
        <rect
          x="124"
          y="30"
          width="62"
          height="30"
          rx="15"
          className={s.solid}
        />
        <text x="155" y="51" textAnchor="middle" className={s.glyph}>
          %
        </text>
      </g>
      <g className={cx(s.ln, s.pop)} style={v(0.24)}>
        <path d="M150 72 l5 10 11 1.6 -8 7.8 1.9 11 -9.9 -5.2 -9.9 5.2 1.9 -11 -8 -7.8 11 -1.6z" />
      </g>
    </Svg>
  );
}

/** Что нужно для подключения: ключ кассы — и готово */
export function KeyScene() {
  return (
    <Svg>
      <rect x="112" y="38" width="98" height="34" rx="10" className={s.ln} />
      {/* Ключ стоит рядом и вставляется в поле — композиция не пустеет */}
      <g className={cx(s.ln, s.flip)} style={v(0, 26)}>
        <circle cx="40" cy="55" r="13" />
        <circle cx="40" cy="55" r="4" />
        <path d="M53 55 H86 M78 55 v9 M70 55 v7" />
      </g>
      <Check x={190} y={55} d={0.22} />
    </Svg>
  );
}

/** Скидки, баллы и подарок — строками в чеке кассы */
export function ReceiptLinesScene() {
  return (
    <Svg>
      <g className={s.ln}>
        <path d="M80 6 H160 V100 l-8 -6 -8 6 -8 -6 -8 6 -8 -6 -8 6 -8 -6 -8 6 -8 -6 -8 6 Z" />
        <path d="M94 22 H146" />
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i} className={s.appear} style={v(i * 0.1, -8, 0)}>
          <circle cx="98" cy={42 + i * 16} r="4" className={s.solid} />
          <path d={`M108 ${42 + i * 16} H146`} className={s.ln} />
        </g>
      ))}
      <Check x={186} y={30} d={0.36} />
    </Svg>
  );
}

/** Оплата картой онлайн — деньги на счёт заведения */
export function CardPayScene() {
  return (
    <Svg>
      <g className={s.ln}>
        <rect x="22" y="34" width="70" height="44" rx="7" />
        <path d="M22 48 H92 M34 66 H54" />
        <rect x="140" y="22" width="80" height="66" rx="10" />
        <path d="M154 42 H206" />
      </g>
      {/* Деньги — от карты гостя на счёт заведения */}
      <circle
        cx="100"
        cy="56"
        r="7"
        className={cx(s.solid, s.travel)}
        style={v(0, 50, 0)}
      />
      <Check x={180} y={66} d={0.2} />
    </Svg>
  );
}

/** Как это выглядит для гостя: листает меню в мессенджере */
export function MenuScrollScene() {
  return (
    <Svg>
      <Phone x={93} y={4} h={102} />
      {[0, 1, 2].map((i) => (
        <g key={i} className={s.appear} style={v(i * 0.08, 0, 14)}>
          <rect
            x="101"
            y={22 + i * 26}
            width="38"
            height="20"
            rx="5"
            className={s.ln}
          />
          <circle cx="110" cy={32 + i * 26} r="4" className={s.solid} />
        </g>
      ))}
      <g className={s.pop} style={v(0.3)}>
        <circle cx="168" cy="32" r="12" className={s.solid} />
        <path d="M168 26 V38 M162 32 H174" className={s.onSolid} />
      </g>
    </Svg>
  );
}

/** Меню по QR-коду: телефон наводится на код — открывается меню */
export function QrScanScene() {
  return (
    <Svg>
      <QrMini x={34} y={22} size={66} />
      <path d="M104 55 H134" className={s.faint} />
      {/* Телефон стоит всегда: сначала рамка камеры, потом меню */}
      <Phone x={144} y={8} h={94} />
      <path
        d="M160 40 h-6 v-6 M184 40 h6 v-6 M160 72 h-6 v6 M184 72 h6 v6"
        className={cx(s.ln, s.early)}
        style={v(0)}
      />
      <path
        d="M154 40 H188 M154 58 H182 M154 76 H188"
        className={cx(s.ln, s.late)}
        style={v(0)}
      />
    </Svg>
  );
}

/** Два мессенджера, одна база: гости из обоих — в один список */
export function MergeScene() {
  return (
    <Svg>
      <MaxMark x={36} y={30} size={34} />
      <TelegramMark x={36} y={80} size={34} />
      <rect x="132" y="12" width="90" height="86" rx="10" className={s.ln} />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M146 ${36 + i * 22} H206`}
          className={cx(s.ln, s.appear)}
          style={v(0.12 + i * 0.1, -6, 0)}
        />
      ))}
      <circle
        cx="60"
        cy="30"
        r="5"
        className={cx(s.solid, s.travel)}
        style={v(0, 78, 6)}
      />
      <circle
        cx="60"
        cy="80"
        r="5"
        className={cx(s.solid, s.travel)}
        style={v(0.1, 78, -22)}
      />
    </Svg>
  );
}

/** Настроим вместе: ты и мы — шестерёнка крутится */
export function TogetherScene() {
  return (
    <Svg>
      <Person x={46} y={36} r={10} />
      <Person x={194} y={36} r={10} />
      <g className={cx(s.ln, s.spin)}>
        <circle cx="120" cy="55" r="14" />
        <path d="M120 31 v8 M120 71 v8 M96 55 h8 M136 55 h8 M103 38 l6 6 M131 66 l6 6 M103 72 l6 -6 M131 44 l6 -6" />
      </g>
      <path
        d="M70 70 Q92 90 106 66 M170 70 Q148 90 134 66"
        className={s.faint}
      />
      <Check x={120} y={98} r={9} d={0.3} />
    </Svg>
  );
}

/** Все точки в одном кабинете: точки встают в список */
export function PointsListScene() {
  return (
    <Svg>
      <g className={s.ln}>
        <rect x="30" y="4" width="180" height="102" rx="10" />
        <path d="M30 22 H210" />
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i} className={s.appear} style={v(i * 0.1, -10, 0)}>
          <Store x={58} y={42 + i * 22} />
          <path d={`M84 ${50 + i * 22} H186`} className={s.ln} />
        </g>
      ))}
    </Svg>
  );
}

/** Гость видит свой город: рядом — ближайшая точка */
export function CityScene() {
  return (
    <Svg>
      <path
        d="M20 30 H220 M20 80 H220 M70 6 V104 M170 6 V104"
        className={s.faint}
      />
      <circle cx="104" cy="58" r="26" className={cx(s.ln, s.pulse)} />
      <Person x={104} y={48} r={7} />
      <g className={cx(s.ln, s.pop)} style={v(0.15)}>
        <path d="M172 50 c0 -14 -22 -14 -22 0 c0 11 11 22 11 22 s11 -11 11 -22 z" />
        <circle cx="161" cy="50" r="4" />
      </g>
    </Svg>
  );
}

/** Один счёт или несколько: деньги каждой точки — на её счёт */
export function AccountsScene() {
  return (
    <Svg>
      {[30, 80].map((y, i) => (
        <g key={y}>
          <Store x={40} y={y - 8} />
          <circle
            cx="62"
            cy={y}
            r="6"
            className={cx(s.solid, s.travel)}
            style={v(i * 0.12, 112, 0)}
          />
          <g className={s.ln}>
            <rect x="182" y={y - 16} width="42" height="30" rx="6" />
            <path d={`M182 ${y - 6} H224`} />
          </g>
        </g>
      ))}
    </Svg>
  );
}

/** Настройка — за пару минут */
export function QuickScene() {
  return (
    <Svg>
      <g className={s.ln}>
        <circle cx="96" cy="62" r="38" />
        <path d="M86 14 H106 M96 14 V24" />
      </g>
      <path
        d="M96 62 L96 36"
        className={cx(s.ln, s.spin)}
        style={{ transformBox: "view-box", transformOrigin: "96px 62px" }}
      />
      <Check x={170} y={62} r={16} d={0.3} />
    </Svg>
  );
}

/** Когда нужна: развилка — без кассы или с кассой без модуля доставки */
export function ForkScene() {
  return (
    <Svg>
      <circle cx="30" cy="55" r="8" className={s.solid} />
      <path
        d="M38 55 H80 L110 26 H150 M80 55 L110 84 H150"
        pathLength={100}
        className={cx(s.ln, s.draw)}
        style={v(0)}
      />
      <g className={cx(s.ln, s.pop)} style={v(0.15)}>
        <rect x="160" y="12" width="40" height="28" rx="5" />
        <path d="M156 44 L204 8" />
      </g>
      <g className={cx(s.ln, s.pop)} style={v(0.25)}>
        <rect x="160" y="70" width="40" height="28" rx="5" />
        <path d="M170 84 H190" />
      </g>
    </Svg>
  );
}

/** Баллы за заказы: копятся звёздами */
export function PointsScene() {
  return (
    <Svg>
      <path d="M40 100 H200" className={s.ln} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className={cx(s.ln, s.appear)} style={v(i * 0.08, 0, -30)}>
          <path
            d={`M${70 + i * 34} ${60 - i * 12} l4.5 9 10 1.5 -7.2 7 1.7 9.9 -9 -4.7 -9 4.7 1.7 -9.9 -7.2 -7 10 -1.5z`}
          />
        </g>
      ))}
    </Svg>
  );
}
