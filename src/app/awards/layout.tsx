import { callQuerySsrServer } from "~/hooks/useQuerySsrServer";
import { appRouter } from "~/server/api/root";

import { SsrContextServer } from "../SsrContextServer";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await callQuerySsrServer(appRouter.awardRouter.getAllAwardsForProfile);
  await callQuerySsrServer(appRouter.awardRouter.getAllAwardImages, {
    shouldLimitToProfile: true,
  });

  return <SsrContextServer>{children}</SsrContextServer>;
}
