"use client";

import { createContext } from "react";

import { type RouterOutputs } from "~/utils/api";

export type SsrContextData = Partial<{
  getPossibleSentences: RouterOutputs["questionRouter"]["getPossibleSentences"];
}>;

export const SsrContext = createContext<SsrContextData>({
  getPossibleSentences: undefined,
});

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
