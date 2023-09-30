import { callQuerySsrServer } from "~/hooks/useQuerySsrServer";
import { appRouter } from "~/server/api/root";

import { StatsDetail } from "./StatsDetail";

import { SsrContextServer } from "../SsrContextServer";

export default async function StatsPage() {
  // create sections for the results history and summary table

  await callQuerySsrServer(appRouter.questionRouter.getUserStats);

  return (
    <SsrContextServer>
      <StatsDetail />
    </SsrContextServer>
  );
}
