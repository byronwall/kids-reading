import { callQuerySsrServer } from "~/hooks/useQuerySsrServer";
import { appRouter } from "~/server/api/root";
import { SsrContextServer } from "~/lib/trpc/SsrContextServer";
import { getServerAuthSession } from "~/server/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (session?.user?.activeProfile?.id) {
    await callQuerySsrServer(appRouter.awardRouter.getAllAwardsForProfile);
    await callQuerySsrServer(appRouter.awardRouter.getAllAwardImages, {
      shouldLimitToProfile: true,
    });
  }

  return <SsrContextServer>{children}</SsrContextServer>;
}
