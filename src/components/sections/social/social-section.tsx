import { SocialLinks } from "@/components/ui/social-links/social-links";
import styles from "./social-section.module.css";

export function SocialSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <SocialLinks />
      </div>
    </section>
  );
}
