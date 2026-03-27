import type { PricingPlan } from "@/types/landing.types";

// Лицензионные планы — из main-server-nyambot/app/data/licenses-data.ts
export const PRICING_PLANS: PricingPlan[] = [
  {
    code: "license-1-month",
    months: 1,
    priceRub: 12000,
    pricePerMonth: 12000,
    discountPercent: 0,
    isPopular: false,
  },
  {
    code: "license-3-months",
    months: 3,
    priceRub: 32400,
    pricePerMonth: 10800,
    discountPercent: 10,
    isPopular: false,
  },
  {
    code: "license-6-months",
    months: 6,
    priceRub: 61200,
    pricePerMonth: 10200,
    discountPercent: 15,
    isPopular: true,
  },
  {
    code: "license-12-months",
    months: 12,
    priceRub: 108000,
    pricePerMonth: 9000,
    discountPercent: 25,
    isPopular: false,
  },
];

// Стандартные лимиты лицензии — из main-server-nyambot license-limit.types.ts
export const LICENSE_LIMITS = {
  maxBotsCount: 10,
  maxStoreCount: 22,
  maxMenuItemCount: 125,
  maxCrewMembersPerStore: 20,
  maxGroupCount: 30,
  maxComboItemsCount: 5,
} as const;
