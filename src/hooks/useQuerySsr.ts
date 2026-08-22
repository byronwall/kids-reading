import {
  type DecorateProcedure,
  type UseTRPCQueryResult,
} from "@trpc/react-query/shared";
import {
  type AnyQueryProcedure,
  type inferProcedureInput,
  type inferProcedureOutput,
} from "@trpc/server";
import { type TRPCClientErrorLike } from "@trpc/client";
import { useContext } from "react";
import { useSession } from "next-auth/react";

import { SsrContext } from "~/lib/trpc/SsrContext";
import { deepSortObjectByKeys } from "~/lib/deepSortObjectByKeys";

export function useQuerySsr<
  QueryProcedure extends AnyQueryProcedure,
  U,
  V extends string
>(
  proc: DecorateProcedure<QueryProcedure, U, V>,
  params?: inferProcedureInput<QueryProcedure>,
  options?: { enabled?: boolean }
): UseTRPCQueryResult<
  inferProcedureOutput<QueryProcedure>,
  TRPCClientErrorLike<QueryProcedure>
> {
  // need to get the initialData from context using the correct key name
  const initialData = useContext(SsrContext);
  const { data: session } = useSession();

  // @ts-expect-error - we don't expose _def on the type layer
  const keys = proc._def().path as string[]; // will be ['awardRouter', 'getActiveProfile']
  const requiresAuthentication = keys[0] === "planRouter";
  const requiresActiveProfile = keys[0] === "awardRouter" || keys[0] === "questionRouter";

  const paramsAsString = params
    ? JSON.stringify(deepSortObjectByKeys(params))
    : "";

  const fullQueryKey = keys.concat(paramsAsString);
  // TODO: need to link the initial data to the the params also

  // traverse the keys into the context object, assume arbitrary depth
  const initialDataForProc = fullQueryKey.reduce((acc, key) => {
    if (acc === undefined) {
      return undefined;
    }

    const possibleData = (acc as any)[key];
    if (possibleData === undefined) {
      return undefined;
    }

    return possibleData;
  }, initialData) as inferProcedureOutput<QueryProcedure>;

  //   console.log("useQuery", { keys, initialData, initialDataForProc });

  return proc.useQuery(params, {
    ...options,
    enabled:
      options?.enabled !== false &&
      (!requiresAuthentication || Boolean(session?.user)) &&
      (!requiresActiveProfile || Boolean(session?.user?.activeProfile?.id)),
    initialData: initialDataForProc,
  });
}
