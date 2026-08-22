import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { QuestionPractice } from "~/components/questions/QuestionPractice";
import { callQuerySsrServer } from "~/hooks/useQuerySsrServer";
import { appRouter } from "~/server/api/root";
import { SsrContextServer } from "~/lib/trpc/SsrContextServer";

export default async function Home() {
  const session = await getServerAuthSession();

  if (session?.user?.activeProfile?.id) {
    await callQuerySsrServer(appRouter.questionRouter.getPossibleSentences);
  }

  if (!session) {
    return (
      <section className="flex w-full max-w-xl flex-col items-center gap-4 px-4 py-16 text-center sm:py-24">
        <h1>A site to help with kid&apos;s reading.</h1>
      </section>
    );
  }

  if (!session.user.activeProfile?.id) {
    return (
      <section className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-4 py-12 text-center sm:py-20">
        <h1>Choose a learner to start practice.</h1>
        <p className="max-w-prose text-slate-600">
          Select a learner from the account menu, or manage learners before you begin.
        </p>
        <Link href="/user" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2">
          Manage learners
        </Link>
      </section>
    );
  }

  return (
    <SsrContextServer>
      <section className="w-full max-w-[46rem]">
        <QuestionPractice />
      </section>
    </SsrContextServer>
  );
}
