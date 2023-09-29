import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

import { appRouter } from "~/server/api/root";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

export async function getTrpcServer(_session?: any) {
  const session = _session ?? (await getServerAuthSession());

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
