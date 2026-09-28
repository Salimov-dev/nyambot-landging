import { ZapuskPage } from "@/components/zapusk/zapusk-page";
import { ZAPUSK_PAGE } from "@/config/zapusk-page.config";
import { createPageMetadata } from "@/config/seo.config";

export const metadata = createPageMetadata({
  title: ZAPUSK_PAGE.metaTitle,
  description: ZAPUSK_PAGE.metaDescription,
  path: ZAPUSK_PAGE.path,
});

export default function Zapusk() {
  return <ZapuskPage />;
}
