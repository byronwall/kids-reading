import { authRouter } from "~/server/api/routers/auth";
import { createTRPCRouter } from "~/server/api/trpc";

import { wordRouter } from "./routers/wordRouter";
import { userRouter } from "./routers/userRouter";
import { questionRouter } from "./routers/questionRouter";
import { sentencesRouter } from "./routers/sentencesRouter";
import { planRouter } from "./routers/planRouter";

export const appRouter = createTRPCRouter({
  authRouter,
  wordRouter,
  userRouter,
  questionRouter,
  sentencesRouter,
  planRouter,
});

export type AppRouter = typeof appRouter;
