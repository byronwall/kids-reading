import { type RouterOutputs } from "~/utils/api";

export type LearningPlan =
  RouterOutputs["planRouter"]["getAllLearningPlans"][0];

export type DetailedLearningPlan =
  RouterOutputs["planRouter"]["getSingleLearningPlan"];

export type DetailedLesson = DetailedLearningPlan["lessons"][0];

export type Profile = RouterOutputs["userRouter"]["getAllProfiles"][number];
