import {
  MODULE_TERM_LABEL,
  MODULE_TERM_MONTHS,
  MODULES_PRICING,
  moduleTermDiscountPercent,
  type ILicenseModule,
} from "@/config/modules-pricing.config";
import styles from "./landing-page.module.css";

const NBSP = " ";

const TEXT = {
  label: "Цена за точку — дешевле при оплате за срок",
} as const;

/** «6 700 ₽» — разряды и знак рубля неразрывно: число не рвётся на строки */
const rub = (value: number): string =>
  `${String(value).replace(/\B(?=(\d{3})+(?!\d))/gu, NBSP)}${NBSP}₽`;

/**
 * Цены модуля по срокам — отдельным блоком под тонкой линией, без галочек
 * выгод: срок слева, цена и бейдж «−10%» справа, как у тарифов лицензии
 * (Руслан 24.10.2026: «отдели стоимость за периоды от преимуществ», «· −» и
 * «₽−10%» сливались). Одна разметка на /moduli, /rabota-s-zalom и в блоке
 * «Модули» главной; числа — из `modules-pricing.config.ts`. Под тарифами
 * главной месяц не повторяем — цена за месяц там крупно выше
 * (`longTermsOnly`).
 */
export function ModuleTerms({
  module,
  longTermsOnly = false,
  className,
}: {
  module: ILicenseModule;
  longTermsOnly?: boolean;
  /** Свои отступы блока там, где карточка не посадочной */
  className?: string;
}) {
  const prices = MODULES_PRICING[module].priceRub;
  const terms = longTermsOnly
    ? MODULE_TERM_MONTHS.filter((months) => months > 1)
    : MODULE_TERM_MONTHS;

  return (
    <div
      className={
        className ? `${styles.moduleTerms} ${className}` : styles.moduleTerms
      }
    >
      <div className={styles.moduleTermsBody}>
        <span className={styles.moduleTermsLabel}>{TEXT.label}</span>
        <ul className={styles.moduleTermsList}>
          {terms.map((months) => {
            const discount = moduleTermDiscountPercent(module, months);

            return (
              <li key={months} className={styles.moduleTerm}>
                <span>{MODULE_TERM_LABEL[months]}</span>
                <span className={styles.moduleTermPrice}>
                  {rub(prices[months])}
                </span>
                {discount > 0 ? (
                  <span className={styles.moduleTermBadge}>−{discount}%</span>
                ) : (
                  <span aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
