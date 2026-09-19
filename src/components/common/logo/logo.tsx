import Image from "next/image";
import { Flex, Typography } from "antd";
import { BRAND_CONFIG } from "@/config/brand.config";
import { theme } from "@/config/theme";
import styles from "./logo.module.css";

const { Text } = Typography;

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

/** Размер знака в пикселях. Мобильную сбавку задаёт CSS через `--logo-size`. */
const SIZE_MAP = { sm: 24, md: 30, lg: 40 } as const;
const FONT_MAP = { sm: 14, md: 17, lg: 21 } as const;

export function Logo({ size = "md" }: LogoProps) {
  const imgSize = SIZE_MAP[size];
  const fontSize = FONT_MAP[size];

  return (
    <Flex align="center" gap={10} className={styles.logo}>
      <div
        className={styles.icon}
        style={{ ["--logo-size" as string]: `${imgSize}px` }}
      >
        <Image
          src={BRAND_CONFIG.logoFile}
          alt={BRAND_CONFIG.name}
          width={imgSize}
          height={imgSize}
          className={styles.image}
          priority
        />
      </div>
      <Text
        strong
        className={styles.title}
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
