import {
  moduleMonthlyRub,
  type ILicenseModule,
} from "@/config/modules-pricing.config";
import styles from "./landing-page.module.css";

const NBSP = " ";

const TEXT = {
  perMonth: "в месяц за точку",
  term: "Срок — от 1 месяца до конца лицензии",
} as const;

/** «2 490 ₽» — разряды и знак рубля неразрывно: число не рвётся на строки */
const rub = (value: number): string =>
  `${String(value).replace(/\B(?=(\d{3})+(?!\d))/gu, NBSP)}${NBSP}₽`;

/**
 * Цена модуля: крупно — за месяц за точку, под ней тихой строкой — срок.
 * 🔴 Скидки за срок у модулей нет (Руслан 24.10.2026): цен за 3, 6 и 12
 * месяцев и бейджей «−10%» не показываем. Одна разметка на /moduli,
 * /rabota-s-zalom и в блоке «Модули» под тарифами главной; число — из
 * `modules-pricing.config.ts`.
 */
export function ModulePrice({
  module,
  className,
}: {
  module: ILicenseModule;
  /** Свои отступы там, где карточка не посадочной */
  className?: string;
}) {
  return (
    <div
      className={
        className ? `${styles.modulePrice} ${className}` : styles.modulePrice
      }
    >
      <p className={styles.modulePriceMain}>
        <span className={styles.modulePriceValue}>
          {rub(moduleMonthlyRub(module))}
        </span>
        <span className={styles.modulePricePer}>{TEXT.perMonth}</span>
      </p>
      <p className={styles.modulePriceTerm}>{TEXT.term}</p>
    </div>
  );
}
