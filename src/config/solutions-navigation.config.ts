import { LINKS } from "@/config/links.config";

export const SOLUTION_GROUPS = [
  {
    id: "features",
    labelKey: "nav.features",
    links: [
      {
        id: "messengers",
        labelKey: "footer.pageMessengers",
        href: LINKS.pages.messengers,
      },
      {
        id: "loyalty",
        labelKey: "solutions.items.loyalty.title",
        href: LINKS.pages.loyalty,
      },
      {
        id: "komanda",
        labelKey: "solutions.items.komanda.title",
        href: LINKS.pages.komanda,
      },
    ],
  },
  {
    id: "modules",
    labelKey: "solutions.moduleGroup",
    links: [
      {
        id: "hall",
        labelKey: "solutions.items.hall.title",
        href: LINKS.pages.hall,
      },
      {
        id: "corporateLunches",
        labelKey: "pricing.modules.items.corporate.name",
        href: LINKS.pages.corporateLunches,
      },
      {
        id: "modules",
        labelKey: "pricing.modules.allCta",
        href: LINKS.pages.modules,
      },
    ],
  },
  {
    id: "integrations",
    labelKey: "integrations.label",
    links: [
      {
        id: "iiko",
        labelKey: "solutions.items.iiko.title",
        href: LINKS.pages.iiko,
      },
      {
        id: "rkeeper",
        labelKey: "solutions.items.rkeeper.title",
        href: LINKS.pages.rkeeper,
      },
      {
        id: "integrations",
        labelKey: "solutions.items.integrations.title",
        href: LINKS.pages.integrations,
      },
    ],
  },
] as const;

export const FOOTER_SOLUTION_LINKS = [
  { labelKey: "solutions.items.features.title", href: LINKS.pages.features },
  { labelKey: "pricing.modules.allCta", href: LINKS.pages.modules },
  {
    labelKey: "solutions.items.integrations.title",
    href: LINKS.pages.integrations,
  },
  { labelKey: "solutions.items.network.title", href: LINKS.pages.network },
  { labelKey: "solutions.items.faq.title", href: LINKS.pages.faq },
] as const;
