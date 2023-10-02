import { authRouter } from "./routers/auth";
import { createTRPCRouter } from "./trpc";
import { wordRouter } from "./routers/wordRouter";
import { userRouter } from "./routers/userRouter";
import { questionRouter } from "./routers/questionRouter";
import { sentencesRouter } from "./routers/sentencesRouter";
import { planRouter } from "./routers/planRouter";
import { awardRouter } from "./routers/awardRouter";

export const appRouter = createTRPCRouter({
  authRouter,
  wordRouter,
  userRouter,
  questionRouter,
  sentencesRouter,
  planRouter,
  awardRouter,
});

export type AppRouter = typeof appRouter;
