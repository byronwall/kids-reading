"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { trpc } from "~/app/_trpc/client";

import { Button } from "./ui/button";

export function RegisterNewUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutateCreateUser = trpc.authRouter.createUser.useMutation();

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
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
}
