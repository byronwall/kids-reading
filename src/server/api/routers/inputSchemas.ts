import { z } from "zod";

// these are stored in their own file so they can be imported client side

export const LearningPlanCreateSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
});

export const LessonCreateSchema = z.object({
  name: z.string().nonempty(),
  description: z.string(),
  learningPlanId: z.string(),
});
