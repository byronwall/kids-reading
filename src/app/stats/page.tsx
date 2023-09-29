import { StatsDetail } from "./StatsDetail";

import { getTrpcServer } from "../_trpc/serverClient";
import { SsrContextProvider } from "../SsrContext";

export default async function StatsPage() {
  // create sections for the results history and summary table

  // get the user stats
  const trpcServer = await getTrpcServer();
  const getUserStats = await trpcServer.questionRouter.getUserStats();

  return (
    <SsrContextProvider
      initialData={{
        initialData: {
          questionRouter: {
            getUserStats,
          },
        },
      }}
    >
      <StatsDetail />
    </SsrContextProvider>
  );
}
