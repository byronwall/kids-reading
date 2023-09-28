import { getServerAuthSession } from "~/server/auth";
import { QuestionPractice } from "~/components/QuestionPractice";

import { getTrpcServer } from "./_trpc/serverClient";
import { SsrContextProvider } from "./SsrContext";

export default async function Home() {
  const session = await getServerAuthSession();

  const trpcServer = getTrpcServer(session);
  const getPossibleSentences =
    await trpcServer.questionRouter.getPossibleSentences();

  if (!session) {
    return (
      <section className="flex flex-col items-center gap-4">
        <h1>A site to help with kid's reading.</h1>
      </section>
    );
  }

  return (
    <SsrContextProvider initialData={{ getPossibleSentences }}>
      <section className="flex flex-col items-center gap-4">
        <QuestionPractice />
      </section>
    </SsrContextProvider>
  );
}
