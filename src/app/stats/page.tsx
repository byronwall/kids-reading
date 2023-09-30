import { callQuerySsrServer } from "~/hooks/useQuerySsrServer";
import { appRouter } from "~/server/api/root";
import { StatsDetail } from "~/components/stats/StatsDetail";
import { SsrContextServer } from "~/lib/trpc/SsrContextServer";

export default async function StatsPage() {
  // create sections for the results history and summary table

  await callQuerySsrServer(appRouter.questionRouter.getUserStats);

  return (
    <SsrContextServer>
      <StatsDetail />
    </SsrContextServer>
  );
}
