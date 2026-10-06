import { HOME_SECTION, type IHomeSection } from "@/config/landing-pages.config";
import { KillerSection } from "@/components/sections/killer/killer-section";
import { CompareSection } from "@/components/sections/compare/compare-section";
import { TryDemoSection } from "@/components/sections/try-demo/try-demo-section";
import { KomandaSection } from "@/components/sections/komanda/komanda-section";
import { IntegrationsSection } from "@/components/sections/integrations/integrations-section";
import { FeaturesSection } from "@/components/sections/features/features-section";
import { CrmDemoSection } from "@/components/sections/crm-demo/crm-demo-section";
import styles from "./landing-page.module.css";

/** Тарифы живут на главной — с подстраницы кнопка ведёт туда */
const HOME_PRICING = "/#pricing";

const SECTIONS: Record<IHomeSection, () => React.ReactElement | null> = {
  [HOME_SECTION.KILLER]: () => <KillerSection pricingHref={HOME_PRICING} />,
  [HOME_SECTION.COMPARE]: CompareSection,
  [HOME_SECTION.DEMO]: TryDemoSection,
  [HOME_SECTION.KOMANDA]: KomandaSection,
  [HOME_SECTION.INTEGRATIONS]: IntegrationsSection,
  [HOME_SECTION.FEATURES]: FeaturesSection,
  [HOME_SECTION.CRM]: CrmDemoSection,
};

/**
 * Секции главной под ответом подстраницы — во всю ширину, как на главной.
 * Человек из выдачи на главную почти не переходит (Руслан 06.10.2026): смысл
 * продукта — путь заказа, сравнение, демо — должен быть на странице, куда он
 * пришёл. Секции те же компоненты: правка главной обновляет и подстраницы.
 */
export function HomeSections({ sections }: { sections: IHomeSection[] }) {
  return (
    <div className={styles.homeSections}>
      {sections.map((id) => {
        const Section = SECTIONS[id];
        return <Section key={id} />;
      })}
    </div>
  );
}
