import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/utils/api";

export function AuthShowcase() {
  const { data: sessionData } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data: secretMessage } = api.authRouter.getSecretMessage.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );

  const mutateCreateUser = api.authRouter.createUser.useMutation();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await mutateCreateUser.mutateAsync({ email, password });

      await signIn();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <pre>
        <code>{JSON.stringify(sessionData, null, 4)}</code>
      </pre>
      <p className="text-center text-2xl ">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold  no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-lg font-medium">Email:</span>
          <input
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-lg font-medium">Password:</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
}
