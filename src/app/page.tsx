import { getServerAuthSession } from "~/server/auth";
import { QuestionPractice } from "~/components/QuestionPractice";
import { callQuerySsrServer } from "~/hooks/useQuerySsrServer";
import { appRouter } from "~/server/api/root";

import { SsrContextProvider } from "./SsrContext";

export default async function Home() {
  const session = await getServerAuthSession();

  const initialData = await callQuerySsrServer(
    appRouter.questionRouter.getPossibleSentences
  );

  if (!session) {
    return (
      <section className="flex flex-col items-center gap-4">
        <h1>A site to help with kid's reading.</h1>
      </section>
    );
  }

  return (
    <SsrContextProvider initialData={initialData}>
      <section className="flex flex-col items-center gap-4">
        <QuestionPractice />
      </section>
    </SsrContextProvider>
  );
}
