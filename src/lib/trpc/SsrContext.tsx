"use client";

import { type AnyProcedure, type AnyRouter } from "@trpc/server";
import { type inferTransformedProcedureOutput } from "@trpc/server/shared";
import { createContext, useContext } from "react";

import { type appRouter } from "~/server/api/root";
import { deepMerge } from "~/lib/deepMerge";

export type SsrQueryShape<TRouter extends AnyRouter> = {
  [TKey in keyof TRouter["_def"]["record"]]: TRouter["_def"]["record"][TKey] extends infer TRouterOrProcedure
    ? TRouterOrProcedure extends AnyRouter
      ? Partial<SsrQueryShape<TRouterOrProcedure>>
      : TRouterOrProcedure extends AnyProcedure
      ? TRouterOrProcedure extends string // this is the JSONed params
        ? Partial<inferTransformedProcedureOutput<TRouterOrProcedure>>
        : never
      : never
    : undefined;
};

type SsrDataStructure = Partial<SsrQueryShape<typeof appRouter>>;

export const SsrContext = createContext<SsrDataStructure>({});

export function SsrContextProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: SsrDataStructure;
}) {
  const parentData = useContext(SsrContext);

  // merge the data from the parent context with the data from the server
  // this allows us to nest contexts and have them all be available on the client
  const providerValue = deepMerge(parentData, initialData);

  // console.log("SsrContextProvider", { providerValue, initialData, parentData });

  return (
    <SsrContext.Provider value={providerValue}>{children}</SsrContext.Provider>
  );
}
