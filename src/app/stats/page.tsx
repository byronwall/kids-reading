import { callQuerySsrServer } from "~/hooks/useQuerySsrServer";
import { appRouter } from "~/server/api/root";
import { StatsDetail } from "~/components/stats/StatsDetail";
import { SsrContextServer } from "~/lib/trpc/SsrContextServer";
import { getServerAuthSession } from "~/server/auth";

export default async function StatsPage() {
  // create sections for the results history and summary table

  const session = await getServerAuthSession();
  if (session?.user?.activeProfile?.id) {
    await callQuerySsrServer(appRouter.questionRouter.getUserStats);
  }

  return (
    <SsrContextServer>
      <StatsDetail />
    </SsrContextServer>
  );
}
