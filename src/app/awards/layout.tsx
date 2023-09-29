import { callQuerySsrServer } from "~/hooks/useQuerySsrServer";
import { appRouter } from "~/server/api/root";

import { SsrContextProvider } from "../SsrContext";
import { deepMerge } from "../deepMerge";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialData = await callQuerySsrServer(
    appRouter.awardRouter.getAllAwardsForProfile
  );

  const moreData = await callQuerySsrServer(
    appRouter.awardRouter.getAllAwardImages,
    {
      shouldLimitToProfile: true,
    }
  );

  const mergedData = deepMerge(initialData, moreData);

  return (
    <SsrContextProvider initialData={mergedData}>{children}</SsrContextProvider>
  );
}
