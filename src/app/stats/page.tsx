import { callQuerySsrServer } from "~/hooks/useQuerySsrServer";
import { appRouter } from "~/server/api/root";

import { StatsDetail } from "./StatsDetail";

import { SsrContextProvider } from "../SsrContext";

export default async function StatsPage() {
  // create sections for the results history and summary table

  const initialData = await callQuerySsrServer(
    appRouter.questionRouter.getUserStats
  );

  return (
    <SsrContextProvider initialData={initialData}>
      <StatsDetail />
    </SsrContextProvider>
  );
}
