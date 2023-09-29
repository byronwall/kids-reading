import { deslugify } from "~/utils";
import { SsrContextProvider } from "~/app/SsrContext";
import { callQuerySsrServer } from "~/hooks/useQuerySsrServer";
import { appRouter } from "~/server/api/root";

import { LearningPlanSingle } from "./LessonPlanSingle";

type PageProps = {
  params: {
    planNameSlugged: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { planNameSlugged } = params;

  const planName = deslugify(planNameSlugged);

  const initialData = await callQuerySsrServer(
    appRouter.planRouter.getSingleLearningPlan,
    {
      learningPlanName: planName,
    }
  );

  return (
    <SsrContextProvider initialData={initialData}>
      <LearningPlanSingle planName={planName} />
    </SsrContextProvider>
  );
}
