import { LandingPage } from "@/components/landing-page/landing-page";
import { LANDING_PAGE, LANDING_PAGES } from "@/config/landing-pages.config";
import { createPageMetadata } from "@/config/seo.config";

const CONTENT = LANDING_PAGES[LANDING_PAGE.SAYT_ILI_PRILOZHENIE];

export const metadata = createPageMetadata({
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  path: CONTENT.path,
});

export default function SaytIliPrilozheniePage() {
  return <LandingPage content={CONTENT} />;
}
