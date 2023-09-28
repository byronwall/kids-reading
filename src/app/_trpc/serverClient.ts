import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export function getTrpcServer(session: any) {
  const options = {
    links: [
      httpBatchLink({
        url: "/api/trpc",
      }),
    ],
    transformer: superjson,
    prisma: prisma,
    session: session,
  } as any;
  return appRouter.createCaller(options);
}
