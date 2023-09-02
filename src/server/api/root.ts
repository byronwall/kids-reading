import { authRouter } from "~/server/api/routers/auth";
import { createTRPCRouter } from "~/server/api/trpc";

import { wordRouter } from "./routers/wordRouter";

export const appRouter = createTRPCRouter({
  authRouter,
  wordRouter,
});

export type AppRouter = typeof appRouter;
