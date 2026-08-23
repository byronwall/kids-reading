import { callQuerySsrServer } from "~/hooks/useQuerySsrServer";
import { appRouter } from "~/server/api/root";
import { SsrContextServer } from "~/lib/trpc/SsrContextServer";
import { LearningPlanSingle } from "~/components/plans/LessonPlanSingle";

type PageProps = {
  params: {
    planNameSlugged: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { planNameSlugged } = params;

  await callQuerySsrServer(appRouter.planRouter.getSingleLearningPlan, {
    learningPlanName: planNameSlugged,
  });

  return (
    <SsrContextServer>
      <LearningPlanSingle planName={planNameSlugged} />
    </SsrContextServer>
  );
}
