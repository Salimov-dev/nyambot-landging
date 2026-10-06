"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PAGE_SCENE, type IPageScene } from "@/config/landing-pages.config";
import {
  CartScene,
  LoyaltyScene,
  MoneyScene,
  NetworkScene,
  PosScene,
  QrScene,
} from "@/components/sections/killer/killer-scenes";
import killerStyles from "@/components/sections/killer/killer-section.module.css";
import {
  BroadcastScene,
  ChatScene,
  ConstructorScene,
  DeliveryScene,
  GrowthScene,
  RetentionScene,
} from "@/components/sections/features/features-scenes";
import {
  NewPointScene,
  NoSignupScene,
  OneBotScene,
  PricesScene,
  SetupScene,
} from "@/components/sections/compare/compare-scenes";
import * as own from "./page-scenes";
import styles from "./landing-page.module.css";

/** Как сцена движется — по секции, откуда она пришла:
 *  - path — картинки пути заказа («Главное»): проигрываются к итогу по классу play;
 *  - loop — сцены «Возможностей»: крутятся сами по кругу;
 *  - turn — пары «Сравнения»: «обычно → у нас» один раз при монтировании. */
const MOTION = {
  path: "path",
  loop: "loop",
  turn: "turn",
} as const;
type IMotion = (typeof MOTION)[keyof typeof MOTION];

type ISceneEntry = {
  Scene: () => React.ReactElement;
  motion: IMotion;
  color: string;
};

/** Цвета — те же, что у сцены в её секции главной */
const SCENES: Record<IPageScene, ISceneEntry> = {
  [PAGE_SCENE.QR]: { Scene: QrScene, motion: MOTION.path, color: "#e8590c" },
  [PAGE_SCENE.NETWORK]: {
    Scene: NetworkScene,
    motion: MOTION.path,
    color: "#15aabf",
  },
  [PAGE_SCENE.CART]: {
    Scene: CartScene,
    motion: MOTION.path,
    color: "#14c4a2",
  },
  [PAGE_SCENE.LOYALTY]: {
    Scene: LoyaltyScene,
    motion: MOTION.path,
    color: "#c2255c",
  },
  [PAGE_SCENE.MONEY]: {
    Scene: MoneyScene,
    motion: MOTION.path,
    color: "#2f9e44",
  },
  [PAGE_SCENE.POS]: { Scene: PosScene, motion: MOTION.path, color: "#7048e8" },
  [PAGE_SCENE.RETENTION]: {
    Scene: RetentionScene,
    motion: MOTION.loop,
    color: "#52c41a",
  },
  [PAGE_SCENE.GROWTH]: {
    Scene: GrowthScene,
    motion: MOTION.loop,
    color: "#14c4a2",
  },
  [PAGE_SCENE.BROADCAST]: {
    Scene: BroadcastScene,
    motion: MOTION.loop,
    color: "#be4bdb",
  },
  [PAGE_SCENE.CONSTRUCTOR]: {
    Scene: ConstructorScene,
    motion: MOTION.loop,
    color: "#e64980",
  },
  [PAGE_SCENE.CHAT]: {
    Scene: ChatScene,
    motion: MOTION.loop,
    color: "#7950f2",
  },
  [PAGE_SCENE.DELIVERY]: {
    Scene: DeliveryScene,
    motion: MOTION.loop,
    color: "#f76707",
  },
  [PAGE_SCENE.ONE_BOT]: {
    Scene: OneBotScene,
    motion: MOTION.turn,
    color: "#ff8c00",
  },
  [PAGE_SCENE.NEW_POINT]: {
    Scene: NewPointScene,
    motion: MOTION.turn,
    color: "#ff8c00",
  },
  [PAGE_SCENE.NO_SIGNUP]: {
    Scene: NoSignupScene,
    motion: MOTION.turn,
    color: "#ff8c00",
  },
  [PAGE_SCENE.SETUP]: {
    Scene: SetupScene,
    motion: MOTION.turn,
    color: "#ff8c00",
  },
  [PAGE_SCENE.PRICES]: {
    Scene: PricesScene,
    motion: MOTION.turn,
    color: "#ff8c00",
  },
  // Свои сцены подстраниц — петли, как у «Возможностей»
  [PAGE_SCENE.SYNC]: {
    Scene: own.SyncScene,
    motion: MOTION.loop,
    color: "#15aabf",
  },
  [PAGE_SCENE.MENU_EDIT]: {
    Scene: own.MenuEditScene,
    motion: MOTION.loop,
    color: "#f59f00",
  },
  [PAGE_SCENE.STATUS]: {
    Scene: own.StatusScene,
    motion: MOTION.loop,
    color: "#14c4a2",
  },
  [PAGE_SCENE.DASHBOARD]: {
    Scene: own.DashboardScene,
    motion: MOTION.loop,
    color: "#4dabf7",
  },
  [PAGE_SCENE.TEAM]: {
    Scene: own.TeamScene,
    motion: MOTION.loop,
    color: "#7950f2",
  },
  [PAGE_SCENE.KITCHEN]: {
    Scene: own.KitchenScene,
    motion: MOTION.loop,
    color: "#ff6b4a",
  },
  [PAGE_SCENE.COURIER]: {
    Scene: own.CourierScene,
    motion: MOTION.loop,
    color: "#20c997",
  },
  [PAGE_SCENE.ALERT]: {
    Scene: own.AlertScene,
    motion: MOTION.loop,
    color: "#fa5252",
  },
  [PAGE_SCENE.SEARCH]: {
    Scene: own.SearchScene,
    motion: MOTION.loop,
    color: "#fab005",
  },
  [PAGE_SCENE.ACCESS]: {
    Scene: own.AccessScene,
    motion: MOTION.loop,
    color: "#7048e8",
  },
  [PAGE_SCENE.FRANCHISE]: {
    Scene: own.FranchiseScene,
    motion: MOTION.loop,
    color: "#e8590c",
  },
  [PAGE_SCENE.SITE]: {
    Scene: own.SiteScene,
    motion: MOTION.loop,
    color: "#4dabf7",
  },
  [PAGE_SCENE.CHOOSER]: {
    Scene: own.ChooserScene,
    motion: MOTION.loop,
    color: "#be4bdb",
  },
  [PAGE_SCENE.DOMAIN]: {
    Scene: own.DomainScene,
    motion: MOTION.loop,
    color: "#15aabf",
  },
  [PAGE_SCENE.CHOICE_STATS]: {
    Scene: own.ChoiceStatsScene,
    motion: MOTION.loop,
    color: "#94d82d",
  },
  [PAGE_SCENE.SWAP_BOT]: {
    Scene: own.SwapBotScene,
    motion: MOTION.loop,
    color: "#7950f2",
  },
  [PAGE_SCENE.PRINT]: {
    Scene: own.PrintScene,
    motion: MOTION.loop,
    color: "#f76707",
  },
  [PAGE_SCENE.QR_LOGO]: {
    Scene: own.QrLogoScene,
    motion: MOTION.loop,
    color: "#e64980",
  },
  [PAGE_SCENE.BRAND]: {
    Scene: own.BrandScene,
    motion: MOTION.loop,
    color: "#ff6b4a",
  },
  [PAGE_SCENE.KEEP]: {
    Scene: own.KeepScene,
    motion: MOTION.loop,
    color: "#20c997",
  },
  [PAGE_SCENE.PALETTE]: {
    Scene: own.PaletteScene,
    motion: MOTION.loop,
    color: "#ffffff",
  },
  [PAGE_SCENE.DATA_OWN]: {
    Scene: own.DataOwnScene,
    motion: MOTION.loop,
    color: "#4dabf7",
  },
  [PAGE_SCENE.SHARE]: {
    Scene: own.ShareScene,
    motion: MOTION.loop,
    color: "#15aabf",
  },
  [PAGE_SCENE.SECURE]: {
    Scene: own.SecureScene,
    motion: MOTION.loop,
    color: "#51cf66",
  },
  [PAGE_SCENE.ERASE]: {
    Scene: own.EraseScene,
    motion: MOTION.loop,
    color: "#fa5252",
  },
  [PAGE_SCENE.SERVER]: {
    Scene: own.ServerScene,
    motion: MOTION.loop,
    color: "#7950f2",
  },
  [PAGE_SCENE.CLOCK]: {
    Scene: own.ClockScene,
    motion: MOTION.loop,
    color: "#f59f00",
  },
  [PAGE_SCENE.PROMO_CODE]: {
    Scene: own.PromoCodeScene,
    motion: MOTION.loop,
    color: "#be4bdb",
  },
  [PAGE_SCENE.GIFT]: {
    Scene: own.GiftScene,
    motion: MOTION.loop,
    color: "#e64980",
  },
  [PAGE_SCENE.FIRST_ORDER]: {
    Scene: own.FirstOrderScene,
    motion: MOTION.loop,
    color: "#14c4a2",
  },
  [PAGE_SCENE.ORDER_IN]: {
    Scene: own.OrderInScene,
    motion: MOTION.loop,
    color: "#7048e8",
  },
  [PAGE_SCENE.POS_PROMO]: {
    Scene: own.PosPromoScene,
    motion: MOTION.loop,
    color: "#c2255c",
  },
  [PAGE_SCENE.KEY]: {
    Scene: own.KeyScene,
    motion: MOTION.loop,
    color: "#fab005",
  },
  [PAGE_SCENE.RECEIPT_LINES]: {
    Scene: own.ReceiptLinesScene,
    motion: MOTION.loop,
    color: "#c2255c",
  },
  [PAGE_SCENE.CARD_PAY]: {
    Scene: own.CardPayScene,
    motion: MOTION.loop,
    color: "#2f9e44",
  },
  [PAGE_SCENE.MENU_SCROLL]: {
    Scene: own.MenuScrollScene,
    motion: MOTION.loop,
    color: "#ff6b4a",
  },
  [PAGE_SCENE.QR_SCAN]: {
    Scene: own.QrScanScene,
    motion: MOTION.loop,
    color: "#e8590c",
  },
  [PAGE_SCENE.MERGE]: {
    Scene: own.MergeScene,
    motion: MOTION.loop,
    color: "#4dabf7",
  },
  [PAGE_SCENE.TOGETHER]: {
    Scene: own.TogetherScene,
    motion: MOTION.loop,
    color: "#ff8c00",
  },
  [PAGE_SCENE.POINTS_LIST]: {
    Scene: own.PointsListScene,
    motion: MOTION.loop,
    color: "#15aabf",
  },
  [PAGE_SCENE.CITY]: {
    Scene: own.CityScene,
    motion: MOTION.loop,
    color: "#20c997",
  },
  [PAGE_SCENE.ACCOUNTS]: {
    Scene: own.AccountsScene,
    motion: MOTION.loop,
    color: "#2f9e44",
  },
  [PAGE_SCENE.QUICK]: {
    Scene: own.QuickScene,
    motion: MOTION.loop,
    color: "#14c4a2",
  },
  [PAGE_SCENE.FORK]: {
    Scene: own.ForkScene,
    motion: MOTION.loop,
    color: "#7950f2",
  },
  [PAGE_SCENE.POINTS]: {
    Scene: own.PointsScene,
    motion: MOTION.loop,
    color: "#fab005",
  },
};

/** Ритм сцен — как в их секциях главной */
const RHYTHM = {
  "--step": "2.6s",
  "--cycle": "4.4s",
  "--scene": "4.7s",
} as CSSProperties;

/**
 * Живая сцена карточки подстраницы. Сцены пути и сравнения играют один раз —
 * когда карточка показалась на экране (иначе доиграли бы за экраном и стояли
 * в итоге), сцены «Возможностей» крутятся сами.
 */
/** Сдвиг петли между соседними карточками, с */
const CARD_OFFSET_S = 0.7;

export function PageScene({
  scene,
  index = 0,
}: {
  scene: IPageScene;
  index?: number;
}) {
  const { Scene, motion, color } = SCENES[scene];
  const ref = useRef<HTMLDivElement>(null);
  const [played, setPlayed] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || motion === MOTION.loop) return;
    const observer = new IntersectionObserver(
      ([entry], self) => {
        if (!entry.isIntersecting) return;
        setPlayed((n) => n + 1);
        self.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [motion]);

  // Сравнение до показа стоит в «обычно» — монтируем сцену только в кадре
  const hidden = motion === MOTION.turn && played === 0;

  return (
    <div
      ref={ref}
      className={styles.blockScene}
      style={
        {
          ...RHYTHM,
          color,
          "--offset": `${-index * CARD_OFFSET_S}s`,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      {hidden ? null : (
        <div
          key={played}
          className={
            motion === MOTION.path && played > 0 ? killerStyles.play : undefined
          }
        >
          <Scene />
        </div>
      )}
    </div>
  );
}
