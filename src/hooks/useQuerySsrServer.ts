import {
  type AnyProcedure,
  type AnyRouter,
  type AnyQueryProcedure,
  type inferProcedureInput,
  type ProcedureRouterRecord,
  type ProcedureRecord,
} from "@trpc/server";
import { cache } from "react";

import { type SsrQueryShape } from "~/lib/trpc/SsrContext";
import { getTrpcServer } from "~/lib/trpc/serverClient";
import { deepMerge } from "~/lib/deepMerge";
import { appRouter } from "~/server/api/root";
import { deepSortObjectByKeys } from "~/lib/deepSortObjectByKeys";

const routerKeyMap = createRouterMap(appRouter);

type SsrShape = Partial<SsrQueryShape<typeof appRouter>>;

export const getInitialData = cache(() => {
  const initialData: SsrShape = {};

  return initialData;
});

export async function callQuerySsrServer<
  QueryProcedure extends AnyQueryProcedure
>(
  proc: QueryProcedure,
  params?: inferProcedureInput<QueryProcedure>
): Promise<SsrShape> {
  const newInitialData = await getDataForSingleProc(proc, params);

  const initialData = getInitialData();

  const mergedData = deepMerge(initialData, newInitialData);

  // Object.assign to forcefully update the cache
  // return the complete data object if someone wants it server side
  return Object.assign(initialData, mergedData);
}

async function getDataForSingleProc<QueryProcedure extends AnyQueryProcedure>(
  proc: QueryProcedure,
  params?: inferProcedureInput<QueryProcedure>
) {
  const trpcServer = await getTrpcServer();

  const keys = routerKeyMap.get(proc);

  if (!keys) {
    throw new Error(`Could not find keys for procedure.`);
  }

  const paramsAsString = params
    ? JSON.stringify(deepSortObjectByKeys(params))
    : "";

  // get the true caller -- this needs to go through the createCaller proxy
  // this all ensures that the context is setup correctly
  const trpcServerProc = keys.reduce((acc, key) => {
    return (acc as any)[key];
  }, trpcServer);

  try {
    // this call will fail if user is not authenticated
    const result = await (trpcServerProc as any)(params);

    // iterate keys and set the initialData
    // generalize that to arbitrary depth, reduce right
    // this adds the params to make a unique key
    const initialData = keys.concat(paramsAsString).reduceRight((acc, key) => {
      return {
        [key]: acc,
      };
    }, result) as SsrQueryShape<typeof appRouter>;

    // nest result based on keys
    // keys = ['awardRouter', 'getActiveProfile']
    // TODO: need to link the initial data to the the params also
    //   console.log("useQuery", { keys, initialData, initialDataForProc });
    return initialData;
  } catch (e) {
    console.log("error", e);
    return {};
  }
}

export function createRouterMap(router: AnyRouter) {
  const routerProcedures: ProcedureRecord = {};

  function isRouter(
    procedureOrRouter: AnyProcedure | AnyRouter
  ): procedureOrRouter is AnyRouter {
    return "router" in procedureOrRouter._def;
  }

  function recursiveGetPaths(procedures: ProcedureRouterRecord, path = "") {
    for (const [key, procedureOrRouter] of Object.entries(procedures ?? {})) {
      const newPath = `${path}${key}`;

      if (isRouter(procedureOrRouter)) {
        recursiveGetPaths(procedureOrRouter._def.procedures, `${newPath}.`);
        continue;
      }

      if (routerProcedures[newPath]) {
        throw new Error(`Duplicate key: ${newPath}`);
      }

      routerProcedures[newPath] = procedureOrRouter;
    }
  }
  const procedures = router._def.procedures;
  recursiveGetPaths(procedures);

  // create a map that goes: procedure -> path
  const procedureMap = new Map<AnyProcedure, string[]>();
  for (const [path, procedure] of Object.entries(routerProcedures)) {
    // split path into array
    const pathArray = path.split(".");

    procedureMap.set(procedure, pathArray);
  }

  return procedureMap;
}
