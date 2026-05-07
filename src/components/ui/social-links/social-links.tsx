"use client";

import Image from "next/image";
import { LINKS } from "@/config/links.config";
import { reachGoal, type MetrikaGoal } from "@/config/metrika";
import styles from "./social-links.module.css";

const SOCIALS: { key: string; label: string; href: string; icon: string; goal: MetrikaGoal }[] = [
  { key: "telegram", label: "Telegram", href: LINKS.social.telegram, icon: "/images/social/tg.png", goal: "click_social_telegram" },
  { key: "max", label: "MAX", href: LINKS.social.max, icon: "/images/social/max.svg", goal: "click_social_max" },
  { key: "rutube", label: "Rutube", href: LINKS.social.rutube, icon: "/images/social/rutube.png", goal: "click_social_rutube" },
  { key: "vk", label: "ВКонтакте", href: LINKS.social.vk, icon: "/images/social/VK.png", goal: "click_social_vk" },
  { key: "youtube", label: "YouTube", href: LINKS.social.youtube, icon: "/images/social/youtube.png", goal: "click_social_youtube" },
  { key: "ok", label: "Одноклассники", href: LINKS.social.ok, icon: "/images/social/OK.png", goal: "click_social_ok" },
];

export function SocialLinks() {
  return (
    <div className={styles.socials}>
      {SOCIALS.map(({ key, label, href, icon, goal }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialBtn}
          aria-label={label}
          onClick={() => reachGoal(goal)}
        >
          <Image src={icon} alt={label} width={24} height={24} style={{ width: 24, height: 24 }} className={styles.socialIcon} />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
}
