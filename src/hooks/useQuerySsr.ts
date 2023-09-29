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

import { SsrContext } from "~/app/SsrContext";

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
  // need to return the useQuery

  // need to get the initialData from context using the correct key name
  const { initialData } = useContext(SsrContext);

  // @ts-expect-error - we don't expose _def on the type layer
  const keys = proc._def().path as string[]; // will be ['awardRouter', 'getActiveProfile']

  // traverse the keys into the context object, assume arbitrary depth
  const initialDataForProc = keys.reduce((acc, key) => {
    // @ts-expect-error - unhappy about index
    return acc[key] as any;
  }, initialData) as inferProcedureOutput<QueryProcedure>;

  //   console.log("useQuery", { keys, initialData, initialDataForProc });

  return proc.useQuery(params, { initialData: initialDataForProc });
}
