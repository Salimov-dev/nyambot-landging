import Link from "next/link";
import {
  BLOCK_ICON,
  type IBlockIcon,
  type ILandingPageBlock,
} from "@/config/landing-blocks.config";
import {
  ListIcon,
  CartIcon,
  WalletIcon,
  PercentIcon,
  ToolsIcon,
  MessageIcon,
  MonitorIcon,
  MapIcon,
  ZapIcon,
  MegaphoneIcon,
  ChartIcon,
  BulbIcon,
  StoreIcon,
  QrCodeIcon,
} from "@/components/ui/icons/icons";
import { LinkedText } from "./linked-text";
import { PageScene } from "./page-scene";
import { ModuleTerms } from "./module-terms";
import styles from "./landing-page.module.css";

const ICONS: Record<IBlockIcon, typeof ListIcon> = {
  [BLOCK_ICON.MENU]: ListIcon,
  [BLOCK_ICON.ORDER]: CartIcon,
  [BLOCK_ICON.MONEY]: WalletIcon,
  [BLOCK_ICON.PROMO]: PercentIcon,
  [BLOCK_ICON.SETUP]: ToolsIcon,
  [BLOCK_ICON.GUEST]: MessageIcon,
  [BLOCK_ICON.STAFF]: MonitorIcon,
  [BLOCK_ICON.DELIVERY]: MapIcon,
  [BLOCK_ICON.ALERT]: ZapIcon,
  [BLOCK_ICON.BROADCAST]: MegaphoneIcon,
  [BLOCK_ICON.METRICS]: ChartIcon,
  [BLOCK_ICON.INSIGHT]: BulbIcon,
  [BLOCK_ICON.BRAND]: StoreIcon,
  [BLOCK_ICON.QR]: QrCodeIcon,
};

/**
 * Карточка посадочной: сцена или значок, заголовок, текст, пункты или цены
 * модуля по срокам, ссылка. Пункты и ссылка прижаты к низу: у соседей в ряду
 * они на одном уровне (Руслан 24.10.2026: «текст пляшет по высоте»).
 */
export function LandingBlock({
  block,
  index,
}: {
  block: ILandingPageBlock;
  index: number;
}) {
  const Icon = ICONS[block.icon];

  return (
    <section
      className={
        block.wide ? `${styles.block} ${styles.blockWide}` : styles.block
      }
    >
      {block.scene ? (
        <PageScene scene={block.scene} index={index} />
      ) : (
        <span className={styles.blockIcon}>
          <Icon size={20} />
        </span>
      )}
      <h2 className={styles.blockTitle}>{block.title}</h2>
      <p className={styles.blockText}>
        <LinkedText text={block.text} />
      </p>
      {block.points ? (
        <ul className={styles.blockPoints}>
          {block.points.map((point) => (
            <li key={point} className={styles.blockPoint}>
              {point}
            </li>
          ))}
        </ul>
      ) : null}
      {block.module ? <ModuleTerms module={block.module} /> : null}
      {block.link ? (
        <Link href={block.link.href} className={styles.blockLink}>
          {block.link.label} →
        </Link>
      ) : null}
    </section>
  );
}
