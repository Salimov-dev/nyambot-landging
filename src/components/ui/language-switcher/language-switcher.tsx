"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Flex, Typography } from "antd";
import { useLanguage } from "@/hooks/use-language.hook";
import { theme } from "@/config/theme";
import styles from "./language-switcher.module.css";

const { Text } = Typography;

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, languageOptions } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <Button
        type="text"
        className={styles.trigger}
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Выбор языка"
      >
        <Flex align="center" gap={4}>
          <Text style={{ fontSize: 14 }}>🌐</Text>
          <Text style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.05em", color: theme.colors.textSecondary }}>
            {currentLanguage.toUpperCase()}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: theme.colors.textTertiary,
              display: "inline-block",
              transition: theme.transitions.fast,
              transform: isOpen ? "rotate(180deg)" : "none",
            }}
          >
            ▾
          </Text>
        </Flex>
      </Button>

      {isOpen && (
        <div className={styles.dropdown}>
          {languageOptions.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.option} ${lang.code === currentLanguage ? styles.active : ""}`}
              onClick={() => {
                changeLanguage(lang.code as Parameters<typeof changeLanguage>[0]);
                setIsOpen(false);
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: lang.code === currentLanguage ? theme.colors.accent : theme.colors.textSecondary,
                  fontWeight: lang.code === currentLanguage ? 600 : 400,
                }}
              >
                {lang.nativeLabel}
              </Text>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
