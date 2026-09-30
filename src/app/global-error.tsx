"use client";

import { useEffect } from "react";
import { BRAND_CONFIG } from "@/config/brand.config";
import { LINKS } from "@/config/links.config";
import { antdLandingDarkTheme } from "@/theme/antd.theme";

type IProps = {
  error: Error & { digest?: string };
};

/**
 * Файлы страницы не догрузились. Так бывает, когда между загрузкой HTML и его
 * скриптов лендинг выкатили заново: робот Яндекса выполняет JS спустя часы и
 * однажды проиндексировал этот экран как главную — сниппетом стали кнопки
 * «Попробовать снова / Перезагрузить страницу» (30.09.2026). Старые сборки
 * теперь хранятся рядом с новой (`docker-entrypoint.sh`), а этот экран —
 * последняя страховка.
 */
const CHUNK_LOAD_ERROR =
  /ChunkLoadError|Loading (CSS )?chunk [\w-]+ failed|Failed to fetch dynamically imported module|Importing a module script failed/i;

/** Не чаще одной автоперезагрузки за это окно — иначе при стойкой поломке страница уйдёт в цикл. */
const RELOAD_GUARD_KEY = "nyambot:chunk-reload-at";
const RELOAD_GUARD_MS = 30_000;

const TEXTS = {
  title: "Страница не загрузилась",
  hint: "Обычно помогает обновить страницу. Если не выйдет — напиши нам, разберёмся.",
  reload: "Обновить страницу",
  telegram: "Телеграм",
  max: "MAX",
  email: "Почта",
} as const;

/** Цвета лендинга: корневой layout с темой здесь не действует. */
const { colorPrimary, colorBgBase, colorText, colorTextSecondary } =
  antdLandingDarkTheme.token ?? {};

const isChunkLoadError = (error: Error): boolean =>
  CHUNK_LOAD_ERROR.test(`${error.name} ${error.message}`);

/** true — перезагрузку можно делать; хранилище недоступно — не рискуем циклом. */
const takeReloadSlot = (): boolean => {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_GUARD_KEY));
    if (last && Date.now() - last < RELOAD_GUARD_MS) return false;
    sessionStorage.setItem(RELOAD_GUARD_KEY, String(Date.now()));
    return true;
  } catch {
    return false;
  }
};

export default function GlobalError({ error }: IProps) {
  useEffect(() => {
    console.error("[GlobalError]", error);

    if (isChunkLoadError(error) && takeReloadSlot()) {
      window.location.reload();
    }
  }, [error]);

  const linkStyle = { color: colorPrimary, fontWeight: 600 };

  return (
    <html lang="ru">
      <body
        style={{
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          margin: 0,
          padding: "48px 16px",
          background: colorBgBase,
          color: colorText,
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <title>{BRAND_CONFIG.name}</title>

        <main style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: 24, margin: "0 0 8px" }}>{TEXTS.title}</h1>

          <p
            style={{
              color: colorTextSecondary,
              lineHeight: 1.5,
              margin: "0 0 24px",
            }}
          >
            {TEXTS.hint}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 24px",
              cursor: "pointer",
              border: "none",
              background: colorPrimary,
              color: "#fff",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {TEXTS.reload}
          </button>

          <p
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
              margin: "24px 0 0",
            }}
          >
            <a href={LINKS.support.max} style={linkStyle}>
              {TEXTS.max}
            </a>
            <a href={LINKS.support.telegram} style={linkStyle}>
              {TEXTS.telegram}
            </a>
            <a href={LINKS.support.email} style={linkStyle}>
              {TEXTS.email}
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
