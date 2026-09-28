export interface PricingPlan {
  code: string;
  months: number;
  priceRub: number;
  pricePerMonth: number;
  discountPercent: number;
  /** Оранжевая лента «Оптимально» и подсветка карточки. */
  isPopular: boolean;
  /** Зелёная лента «Выгодно» — самая низкая цена за месяц. */
  isBestValue: boolean;
}

export interface FeatureItem {
  id: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
  tag?: string;
}

export interface HowItWorksStep {
  step: number;
  titleKey: string;
  descriptionKey: string;
}

export interface ComparisonRow {
  featureKey: string;
  nyambot: boolean | string;
  yandexEda: boolean | string;
  others: boolean | string;
}

export interface FaqItem {
  questionKey: string;
  answerKey: string;
}

export interface NavItem {
  labelKey: string;
  href: string;
}

export interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
}
