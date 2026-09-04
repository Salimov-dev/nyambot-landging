"use client";

import { useEffect, useState } from "react";
import { Tooltip } from "antd";
import styles from "./dot-nav.module.css";

/** Порядок совпадает с порядком секций на странице (page.tsx). Целей здесь
 *  нет: показ секции отмечает SectionViewTracker, а клик по точке к этому же
 *  показу и приводит. */
const SECTIONS: { id: string; label: string }[] = [
  { id: "hero", label: "Главная" },
  { id: "killer", label: "Главное" },
  { id: "try-demo", label: "Демо" },
  { id: "features", label: "Возможности" },
  { id: "network", label: "Сеть" },
  { id: "crm-demo", label: "CRM" },
  { id: "pricing", label: "Тарифы" },
  { id: "how-it-works", label: "Как работает" },
  { id: "switch", label: "Скидка 50%" },
  { id: "security", label: "Безопасность" },
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
        /* Активна секция, пересекающая середину экрана: доля площади не
           годится — секция выше экрана не даст её никогда. */
        { rootMargin: "-45% 0px -45% 0px" },
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
