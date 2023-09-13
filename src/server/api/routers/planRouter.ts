import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

import { LearningPlanCreateSchema } from "./inputSchemas";

export const planRouter = createTRPCRouter({
  getAllLearningPlans: protectedProcedure.query(async () => {
    const plans = await prisma.learningPlan.findMany({
      include: {
        lessons: true,
      },
    });

    return plans;
  }),

  createLearningPlan: protectedProcedure
    .input(LearningPlanCreateSchema)
    .mutation(async ({ input: { name, description } }) => {
      const maxOrder = await prisma.learningPlan.findFirst({
        orderBy: { order: "desc" },
      });

      const plan = await prisma.learningPlan.create({
        data: {
          name,
          description,
          order: (maxOrder?.order ?? 0) + 10,
        },
      });

      return plan;
    }),
});
