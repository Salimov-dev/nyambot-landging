"use client";

import type { ReactNode } from "react";
import { App, ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import { I18nProvider } from "./i18n.provider";
import { antdLandingDarkTheme } from "@/theme/antd.theme";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <I18nProvider>
      <ConfigProvider theme={antdLandingDarkTheme} locale={ruRU}>
        <App>{children}</App>
      </ConfigProvider>
    </I18nProvider>
  );
}
