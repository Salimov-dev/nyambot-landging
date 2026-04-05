import Image from "next/image";
import { Flex, Typography } from "antd";
import { BRAND_CONFIG } from "@/config/brand.config";
import { theme } from "@/config/theme";
import styles from "./logo.module.css";

const { Text } = Typography;

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = { sm: 28, md: 36, lg: 44 } as const;
const FONT_MAP = { sm: 15, md: 18, lg: 22 } as const;

export function Logo({ size = "md" }: LogoProps) {
  const imgSize = SIZE_MAP[size];
  const fontSize = FONT_MAP[size];

  return (
    <Flex align="center" gap={10} className={styles.logo}>
      <div className={styles.icon}>
        <Image
          src={BRAND_CONFIG.logoFile}
          alt={BRAND_CONFIG.name}
          width={imgSize}
          height={imgSize}
          style={{ width: "auto", height: "auto" }}
          priority
        />
      </div>
      <Text
        strong
        style={{
          fontSize,
          color: theme.colors.textPrimary,
          lineHeight: 1,
          letterSpacing: "0.02em",
        }}
      >
        {BRAND_CONFIG.name}
      </Text>
    </Flex>
  );
}
