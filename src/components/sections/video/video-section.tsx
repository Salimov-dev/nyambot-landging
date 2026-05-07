"use client";

import { useEffect, useRef, useState } from "react";
import { Typography } from "antd";
import { theme } from "@/config/theme";
import { reachGoal } from "@/config/metrika";
import { SocialLinks } from "@/components/ui/social-links/social-links";
import styles from "./video-section.module.css";

const { Title } = Typography;

export function VideoSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [videoGoalFired, setVideoGoalFired] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reachGoal("scroll_video");
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (videoGoalFired) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.type === "player:play" || data?.event === "play") {
          reachGoal("video_play");
          setVideoGoalFired(true);
        }
      } catch {
        // не JSON — игнорируем
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [videoGoalFired]);

  return (
    <section id="video" className={styles.section} ref={sectionRef}>
      <div className={styles.inner}>
        <Title
          level={2}
          style={{
            color: theme.colors.accent,
            fontSize: "clamp(24px, 3.5vw, 38px)",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          Что такое Нямбот?
        </Title>

        <div className={styles.wrapper}>
          <iframe
            ref={iframeRef}
            className={styles.iframe}
            src="https://rutube.ru/play/embed/f2898aaaafa45b12485780db020b854a/"
            frameBorder="0"
            allow="clipboard-write; autoplay"
            allowFullScreen
            title="Что такое Нямбот?"
          />
        </div>

        <div className={styles.socials}>
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}
