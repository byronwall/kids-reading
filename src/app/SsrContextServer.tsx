import { getInitialData } from "~/hooks/useQuerySsrServer";

import { SsrContextProvider } from "./SsrContext";

export function SsrContextServer({ children }: { children: React.ReactNode }) {
  // this handles some magic
  // the callQuerySsrServer funcs are building up the initial data
  // it's all happening in the object held by getInitialData()
  const initialData = getInitialData();

  return (
    <SsrContextProvider initialData={initialData}>
      {children}
    </SsrContextProvider>
  );
}
