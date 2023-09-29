"use client";

import { type AnyProcedure, type AnyRouter } from "@trpc/server";
import { type inferTransformedProcedureOutput } from "@trpc/server/shared";
import { createContext } from "react";

import { type appRouter } from "~/server/api/root";

export type SsrQueryShape<TRouter extends AnyRouter> = {
  [TKey in keyof TRouter["_def"]["record"]]: TRouter["_def"]["record"][TKey] extends infer TRouterOrProcedure
    ? TRouterOrProcedure extends AnyRouter
      ? Partial<SsrQueryShape<TRouterOrProcedure>>
      : TRouterOrProcedure extends AnyProcedure
      ? Partial<inferTransformedProcedureOutput<TRouterOrProcedure>>
      : never
    : undefined;
};

// this will become a trpc proc to its output type
type SsrDataStructure = {
  initialData: Partial<SsrQueryShape<typeof appRouter>>;
};

export const SsrContext = createContext<SsrDataStructure>({
  initialData: {},
});

export function SsrContextProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: SsrDataStructure;
}) {
  return (
    <SsrContext.Provider value={initialData}>{children}</SsrContext.Provider>
  );
}
