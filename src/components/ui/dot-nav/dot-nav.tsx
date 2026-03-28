"use client";

import { useEffect, useState } from "react";
import { Tooltip } from "antd";
import styles from "./dot-nav.module.css";

const SECTIONS = [
  { id: "hero", label: "Главная" },
  { id: "stats", label: "Статистика" },
  { id: "features", label: "Возможности" },
  { id: "crm-demo", label: "CRM" },
  { id: "try-demo", label: "Демо" },
  { id: "how-it-works", label: "Как работает" },
  { id: "comparison", label: "Сравнение" },
  { id: "pricing", label: "Тарифы" },
  { id: "faq", label: "FAQ" },
  { id: "cta", label: "Начать" },
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

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={styles.nav} aria-label="Навигация по странице">
      {SECTIONS.map(({ id, label }) => (
        <Tooltip key={id} title={label} placement="right" mouseEnterDelay={0.2}>
          <button
            className={`${styles.dot} ${active === id ? styles.dotActive : ""}`}
            onClick={() => handleClick(id)}
            aria-label={label}
          />
        </Tooltip>
      ))}
    </nav>
  );
}
