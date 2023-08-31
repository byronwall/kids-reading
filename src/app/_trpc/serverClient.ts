import { appRouter } from "~/server/api/root";

import { commonTrpcConfig } from "./Provider";

export const api = appRouter.createCaller(commonTrpcConfig);
