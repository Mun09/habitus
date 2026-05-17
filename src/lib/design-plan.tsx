"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Bilingual } from "./mock/contractors";
import type { DesignOption, StyleKey } from "./mock/design-options";

export type DesignPlan = {
  id: string;
  /** Supabase design_plans.id once the row has been persisted */
  dbId?: string;
  styleKey: StyleKey;
  styleLabel: Bilingual;
  options: DesignOption[];
  spaceImage?: string;
  heroProposal?: string;
  proposals: string[];
  userReferences: string[];
  createdAt: string;
};

type Ctx = {
  plan: DesignPlan | null;
  hasPlan: boolean;
  savePlan: (p: Omit<DesignPlan, "id" | "createdAt">) => void;
  clearPlan: () => void;
};

const DesignPlanContext = createContext<Ctx | undefined>(undefined);

const KEY = "habitus.designPlan";

export function DesignPlanProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [plan, setPlan] = useState<DesignPlan | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DesignPlan;
        // strip blob: references that are no longer valid after reload
        parsed.userReferences = (parsed.userReferences ?? []).filter(
          (r) => !r.startsWith("blob:")
        );
        if (parsed.spaceImage?.startsWith("blob:")) parsed.spaceImage = undefined;
        setPlan(parsed);
      }
    } catch {}
  }, []);

  const persist = (next: DesignPlan | null) => {
    try {
      if (next) window.localStorage.setItem(KEY, JSON.stringify(next));
      else window.localStorage.removeItem(KEY);
    } catch {}
  };

  const savePlan = useCallback(
    (p: Omit<DesignPlan, "id" | "createdAt">) => {
      const next: DesignPlan = {
        ...p,
        id: `plan-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setPlan(next);
      persist(next);
    },
    []
  );

  const clearPlan = useCallback(() => {
    setPlan(null);
    persist(null);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      plan,
      hasPlan: !!plan,
      savePlan,
      clearPlan,
    }),
    [plan, savePlan, clearPlan]
  );

  return (
    <DesignPlanContext.Provider value={value}>
      {children}
    </DesignPlanContext.Provider>
  );
}

export function useDesignPlan() {
  const ctx = useContext(DesignPlanContext);
  if (!ctx)
    throw new Error("useDesignPlan must be used inside DesignPlanProvider");
  return ctx;
}
