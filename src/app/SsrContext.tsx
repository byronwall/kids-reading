"use client";

import { createContext } from "react";

import { type RouterOutputs } from "~/utils/api";

export type SsrContextData = Partial<{
  getPossibleSentences: RouterOutputs["questionRouter"]["getPossibleSentences"];
  getSingleLearningPlan: RouterOutputs["planRouter"]["getSingleLearningPlan"];
  getUserStats: RouterOutputs["questionRouter"]["getUserStats"];
}>;

export const SsrContext = createContext<SsrContextData>({});

export function SsrContextProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: SsrContextData;
}) {
  return (
    <SsrContext.Provider value={initialData}>{children}</SsrContext.Provider>
  );
}
