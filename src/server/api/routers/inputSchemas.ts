import { z } from "zod";

export const LearningPlanCreateSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
});
