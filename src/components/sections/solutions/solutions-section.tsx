"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { SOLUTION_GROUPS } from "@/config/solutions-navigation.config";
import { reachGoal } from "@/config/metrika";
import styles from "./solutions-section.module.css";

/** На этот блок ведёт пункт «Решения» в мобильной шапке. */
export function SolutionsSection() {
  const { t } = useTranslation("landing");

  return (
    <section
      id="solutions"
      aria-labelledby="landing-solutions-title"
      className={styles.section}
    >
      <div className={styles.inner}>
        <h2 id="landing-solutions-title" className={styles.title}>
          {t("nav.solutions")}
        </h2>
        <div className={styles.grid}>
          {SOLUTION_GROUPS.map((group) => (
            <div key={group.id} className={styles.group}>
              <h3 className={styles.groupHeading}>{t(group.labelKey)}</h3>
              <ul className={styles.links}>
                {group.links.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={styles.link}
                      onClick={() =>
                        reachGoal("click_solution", {
                          page: item.id,
                          from: "cards",
                        })
                      }
                    >
                      {t(item.labelKey)}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
