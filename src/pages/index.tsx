import Head from "next/head";
import { api } from "~/utils/api";

import { AuthShowcase } from "../components/AuthShowcase";

export default function Home() {
  const hello = api.authRouter.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>kids reading</title>
        <meta name="description" content="kids reading" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex max-w-2xl border">
        <h1>kids finances</h1>
        <AuthShowcase />
      </main>
    </>
  );
}
