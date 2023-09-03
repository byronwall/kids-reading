import { authRouter } from "~/server/api/routers/auth";
import { createTRPCRouter } from "~/server/api/trpc";

import { wordRouter } from "./routers/wordRouter";
import { userRouter } from "./routers/userRouter";

export const appRouter = createTRPCRouter({
  authRouter,
  wordRouter,
  userRouter,
});

export type AppRouter = typeof appRouter;
