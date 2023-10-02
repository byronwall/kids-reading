import { getServerAuthSession } from "~/server/auth";
import { QuestionPractice } from "~/components/questions/QuestionPractice";
import { callQuerySsrServer } from "~/hooks/useQuerySsrServer";
import { appRouter } from "~/server/api/root";
import { SsrContextServer } from "~/lib/trpc/SsrContextServer";

export default async function Home() {
  const session = await getServerAuthSession();

  await callQuerySsrServer(appRouter.questionRouter.getPossibleSentences);

  if (!session) {
    return (
      <section className="flex flex-col items-center gap-4">
        <h1>A site to help with kid's reading.</h1>
      </section>
    );
  }

  return (
    <SsrContextServer>
      <section className="flex flex-col items-center gap-4">
        <QuestionPractice />
      </section>
    </SsrContextServer>
  );
}
