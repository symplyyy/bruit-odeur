"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type PseudoState = {
  pseudo: string | null;
  hydrated: boolean;
  setPseudo: (name: string) => void;
  clear: () => void;
  _markHydrated: () => void;
};

export const usePseudoStore = create<PseudoState>()(
  persist(
    (set) => ({
      pseudo: null,
      hydrated: false,
      setPseudo: (name) => set({ pseudo: name.trim() }),
      clear: () => set({ pseudo: null }),
      _markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "bno-pseudo",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => state?._markHydrated(),
    },
  ),
);
