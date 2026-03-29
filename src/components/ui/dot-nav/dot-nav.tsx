"use client";

import { useEffect, useState } from "react";
import { Tooltip } from "antd";
import { reachGoal, type MetrikaGoal } from "@/config/metrika";
import styles from "./dot-nav.module.css";

const SECTIONS: { id: string; label: string; goal: MetrikaGoal | null }[] = [
  { id: "hero", label: "Главная", goal: null },
  { id: "stats", label: "Статистика", goal: null },
  { id: "features", label: "Возможности", goal: "scroll_features" },
  { id: "crm-demo", label: "CRM", goal: null },
  { id: "try-demo", label: "Демо", goal: null },
  { id: "how-it-works", label: "Как работает", goal: null },
  { id: "comparison", label: "Сравнение", goal: null },
  { id: "pricing", label: "Тарифы", goal: "scroll_pricing" },
  { id: "faq", label: "FAQ", goal: null },
  { id: "cta", label: "Начать", goal: null },
];

export function DotNav() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.4 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleClick = (id: string, goal: MetrikaGoal | null) => {
    if (goal) reachGoal(goal);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={styles.nav} aria-label="Навигация по странице">
      {SECTIONS.map(({ id, label, goal }) => (
        <Tooltip key={id} title={label} placement="right" mouseEnterDelay={0.2}>
          <button
            className={`${styles.dot} ${active === id ? styles.dotActive : ""}`}
            onClick={() => handleClick(id, goal)}
            aria-label={label}
          />
        </Tooltip>
      ))}
    </nav>
  );
}
