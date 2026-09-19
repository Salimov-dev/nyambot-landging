import { LandingPage } from "@/components/landing-page/landing-page";
import { LANDING_PAGE, LANDING_PAGES } from "@/config/landing-pages.config";
import { createPageMetadata } from "@/config/seo.config";

const CONTENT = LANDING_PAGES[LANDING_PAGE.VOZMOZHNOSTI];

export const metadata = createPageMetadata({
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  path: CONTENT.path,
});

export default function VozmozhnostiPage() {
  return <LandingPage content={CONTENT} />;
}
