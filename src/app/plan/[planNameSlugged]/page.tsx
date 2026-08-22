import { deslugify } from "~/lib/utils";
import { callQuerySsrServer } from "~/hooks/useQuerySsrServer";
import { appRouter } from "~/server/api/root";
import { SsrContextServer } from "~/lib/trpc/SsrContextServer";
import { LearningPlanSingle } from "~/components/plans/LessonPlanSingle";
import { getServerAuthSession } from "~/server/auth";

type PageProps = {
  params: {
    planNameSlugged: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { planNameSlugged } = params;

  const planName = deslugify(planNameSlugged);

  const session = await getServerAuthSession();
  if (session?.user) {
    await callQuerySsrServer(appRouter.planRouter.getSingleLearningPlan, {
      learningPlanName: planName,
    });
  }

  return (
    <SsrContextServer>
      <LearningPlanSingle planName={planName} />
    </SsrContextServer>
  );
}
