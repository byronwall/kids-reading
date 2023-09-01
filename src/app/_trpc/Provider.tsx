"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import superjson from "superjson";

import { trpc } from "./client";

export const commonTrpcConfig = {
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
  transformer: superjson,
} as any;

export default function Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() => trpc.createClient(commonTrpcConfig));
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
