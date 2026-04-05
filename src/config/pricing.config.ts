import type { PricingPlan } from "@/types/landing.types";

// Фоллбэки — используются если API недоступен
export const FALLBACK_PRICING_PLANS: PricingPlan[] = [
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

export const FALLBACK_LICENSE_LIMITS = {
  maxBotsCount: 10,
  maxStoreCount: 22,
  maxMenuItemCount: 125,
} as const;

export type LicenseLimits = {
  maxBotsCount: number;
  maxStoreCount: number;
  maxMenuItemCount: number;
};

interface ApiLicensePlan {
  code: string;
  months: number;
  priceRub: number;
  sortOrder: number;
  isDefault: boolean;
  isActive: boolean;
}

interface ApiSystemLimit {
  key: string;
  value: string | null;
  label: string;
}

const POPULAR_MONTHS = 6;
const BASE_MONTH_PRICE_FALLBACK = 12000;

function apiPlansToPricing(plans: ApiLicensePlan[]): PricingPlan[] {
  const activePlans = plans
    .filter((p) => p.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.months - b.months);

  if (activePlans.length === 0) return FALLBACK_PRICING_PLANS;

  const basePlan = activePlans.find((p) => p.months === 1);
  const baseMonthPrice = basePlan
    ? basePlan.priceRub
    : BASE_MONTH_PRICE_FALLBACK;

  return activePlans.map((plan) => {
    const pricePerMonth = Math.round(plan.priceRub / plan.months);
    const discountPercent =
      baseMonthPrice > 0
        ? Math.round(((baseMonthPrice - pricePerMonth) / baseMonthPrice) * 100)
        : 0;

    return {
      code: plan.code,
      months: plan.months,
      priceRub: plan.priceRub,
      pricePerMonth,
      discountPercent: Math.max(0, discountPercent),
      isPopular: plan.months === POPULAR_MONTHS,
    };
  });
}

function apiLimitsToLicenseLimits(
  systemLimits: ApiSystemLimit[],
  menuLimits: ApiSystemLimit[],
): LicenseLimits {
  const allLimits = [...systemLimits, ...menuLimits];
  const map = new Map(allLimits.map((l) => [l.key, l.value]));

  return {
    maxBotsCount:
      parseInt(map.get("MAX_BOTS_COUNT") ?? "", 10) ||
      FALLBACK_LICENSE_LIMITS.maxBotsCount,
    maxStoreCount:
      parseInt(map.get("MAX_STORES_PER_BOT") ?? "", 10) ||
      FALLBACK_LICENSE_LIMITS.maxStoreCount,
    maxMenuItemCount:
      parseInt(map.get("MAX_MENU_ITEM_COUNT") ?? "", 10) ||
      FALLBACK_LICENSE_LIMITS.maxMenuItemCount,
  };
}

export async function fetchPricingData(): Promise<{
  plans: PricingPlan[];
  limits: LicenseLimits;
}> {
  const apiUrl = process.env.MAIN_SERVER_API_URL;
  const apiKey = process.env.MAIN_SERVER_API_KEY;

  if (!apiUrl) {
    console.log("[Pricing] MAIN_SERVER_API_URL не задан, используются фоллбэки");
    return {
      plans: FALLBACK_PRICING_PLANS,
      limits: FALLBACK_LICENSE_LIMITS,
    };
  }

  console.log("[Pricing] Загрузка данных из", apiUrl);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(apiKey ? { "x-api-key": apiKey } : {}),
  };

  try {
    const [plansRes, systemLimitsRes, menuLimitsRes] = await Promise.all([
      fetch(`${apiUrl}/api/standards/license-plans`, { headers, next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/api/standards/limits/system`, { headers, next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/api/standards/limits/menu`, { headers, next: { revalidate: 3600 } }),
    ]);

    const plansData = plansRes.ok
      ? ((await plansRes.json()) as { success: boolean; data?: ApiLicensePlan[] })
      : null;
    const systemLimitsData = systemLimitsRes.ok
      ? ((await systemLimitsRes.json()) as { success: boolean; data?: ApiSystemLimit[] })
      : null;
    const menuLimitsData = menuLimitsRes.ok
      ? ((await menuLimitsRes.json()) as { success: boolean; data?: ApiSystemLimit[] })
      : null;

    console.log("[Pricing] plans:", plansRes.ok, "system:", systemLimitsRes.ok, "menu:", menuLimitsRes.ok);

    const plans = plansData?.success && plansData.data
      ? apiPlansToPricing(plansData.data)
      : FALLBACK_PRICING_PLANS;
    const limits = apiLimitsToLicenseLimits(
      systemLimitsData?.success && systemLimitsData.data ? systemLimitsData.data : [],
      menuLimitsData?.success && menuLimitsData.data ? menuLimitsData.data : [],
    );

    console.log("[Pricing] Результат:", { plans: plans.length, limits });

    return { plans, limits };
  } catch (error) {
    console.error("[Pricing] Ошибка загрузки:", error);
    return {
      plans: FALLBACK_PRICING_PLANS,
      limits: FALLBACK_LICENSE_LIMITS,
    };
  }
}
