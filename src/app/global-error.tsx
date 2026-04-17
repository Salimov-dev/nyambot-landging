"use client";

import { useEffect } from "react";

type IProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: IProps) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="ru">
      <body
        style={{
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          padding: 24,
          margin: 0,
          background: "#fff",
          color: "#000",
          minHeight: "100vh",
        }}
      >
        <h1 style={{ color: "#cf1322", fontSize: 22, margin: "0 0 12px" }}>
          Ошибка приложения
        </h1>

        <p style={{ margin: "8px 0" }}>
          <strong>Сообщение:</strong>{" "}
          <span style={{ wordBreak: "break-word" }}>
            {error.message || "Неизвестная ошибка"}
          </span>
        </p>

        {error.name ? (
          <p style={{ margin: "8px 0" }}>
            <strong>Тип:</strong> {error.name}
          </p>
        ) : null}

        {error.digest ? (
          <p style={{ margin: "8px 0" }}>
            <strong>Digest:</strong> <code>{error.digest}</code>
          </p>
        ) : null}

        {error.stack ? (
          <details open style={{ marginTop: 16 }}>
            <summary style={{ cursor: "pointer", marginBottom: 8 }}>
              Stack
            </summary>
            <pre
              style={{
                background: "#f5f5f5",
                padding: 12,
                overflow: "auto",
                fontSize: 12,
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                border: "1px solid #e0e0e0",
                borderRadius: 4,
                margin: 0,
              }}
            >
              {error.stack}
            </pre>
          </details>
        ) : null}

        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => reset()}
            style={{
              padding: "10px 18px",
              cursor: "pointer",
              border: "1px solid #1677ff",
              background: "#1677ff",
              color: "#fff",
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            Попробовать снова
          </button>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 18px",
              cursor: "pointer",
              border: "1px solid #d9d9d9",
              background: "#fff",
              color: "#000",
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            Перезагрузить страницу
          </button>
        </div>
      </body>
    </html>
  );
}
