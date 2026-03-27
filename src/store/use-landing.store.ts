"use client";

import { create } from "zustand";

interface LandingStore {
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  activeFaqIndex: number | null;
  setActiveFaqIndex: (index: number | null) => void;
}

export const useLandingStore = create<LandingStore>((set) => ({
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  activeFaqIndex: null,
  setActiveFaqIndex: (index) => set({ activeFaqIndex: index }),
}));
