import { callQuerySsrServer } from "~/hooks/useQuerySsrServer";
import { appRouter } from "~/server/api/root";

import { SsrContextProvider } from "../SsrContext";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialData = await callQuerySsrServer(
    appRouter.planRouter.getAllLearningPlans
  );

  return (
    <SsrContextProvider initialData={initialData}>
      {children}
    </SsrContextProvider>
  );
}
