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

import { SsrContext } from "~/lib/trpc/SsrContext";
import { deepSortObjectByKeys } from "~/lib/deepSortObjectByKeys";

export function useQuerySsr<
  QueryProcedure extends AnyQueryProcedure,
  U,
  V extends string
>(
  proc: DecorateProcedure<QueryProcedure, U, V>,
  params?: inferProcedureInput<QueryProcedure>
): UseTRPCQueryResult<
  inferProcedureOutput<QueryProcedure>,
  TRPCClientErrorLike<QueryProcedure>
> {
  // need to get the initialData from context using the correct key name
  const initialData = useContext(SsrContext);

  // @ts-expect-error - we don't expose _def on the type layer
  const keys = proc._def().path as string[]; // will be ['awardRouter', 'getActiveProfile']

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
      // throw error if dev
      if (process.env.NODE_ENV === "development") {
        console.error(
          `Could not find initialData for ${fullQueryKey.join(".")}`
        );
      }
      return undefined;
    }

    return possibleData;
  }, initialData) as inferProcedureOutput<QueryProcedure>;

  //   console.log("useQuery", { keys, initialData, initialDataForProc });

  return proc.useQuery(params, { initialData: initialDataForProc });
}
