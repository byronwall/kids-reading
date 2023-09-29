import { deslugify } from "~/utils";
import { SsrContextProvider } from "~/app/SsrContext";
import { getTrpcServer } from "~/app/_trpc/serverClient";

import { LearningPlanSingle } from "./LessonPlanSingle";

type PageProps = {
  params: {
    planNameSlugged: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { planNameSlugged } = params;

  const planName = deslugify(planNameSlugged);

  const trpcServer = await getTrpcServer();
  const getSingleLearningPlan =
    await trpcServer.planRouter.getSingleLearningPlan({
      learningPlanName: planName,
    });

  return (
    <SsrContextProvider
      initialData={{
        initialData: {
          planRouter: {
            getSingleLearningPlan,
          },
        },
      }}
    >
      <LearningPlanSingle planName={planName} />
    </SsrContextProvider>
  );
}
