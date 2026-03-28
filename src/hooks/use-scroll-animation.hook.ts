"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

interface UseScrollAnimationOptions {
  once?: boolean;
  amount?: number;
  margin?: string;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { once = true, amount = 0.15, margin = "0px 0px -80px 0px" } = options;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount, margin } as Parameters<
    typeof useInView
  >[1]);

  return { ref, isInView };
}
