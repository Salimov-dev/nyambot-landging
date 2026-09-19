import { LandingPage } from "@/components/landing-page/landing-page";
import { LANDING_PAGE, LANDING_PAGES } from "@/config/landing-pages.config";
import { createPageMetadata } from "@/config/seo.config";

const CONTENT = LANDING_PAGES[LANDING_PAGE.SET_I_FRANSHIZA];

export const metadata = createPageMetadata({
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  path: CONTENT.path,
});

export default function SetIFranshizaPage() {
  return <LandingPage content={CONTENT} />;
}
