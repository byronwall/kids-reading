"use client";

import { useState } from "react";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { trpc } from "~/lib/trpc/client";
import { ProfileRow } from "~/components/user/ProfileRow";
import { useQuerySsr } from "~/hooks/useQuerySsr";

export default function UserPage() {
  const utils = trpc.useContext();

  const [userName, setUserName] = useState("");

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const addProfileMutation = trpc.userRouter.addProfile.useMutation();

  const { data: allProfiles } = useQuerySsr(trpc.userRouter.getAllProfiles);

  const handleAddProfile = async () => {
    if (!userName.trim()) return;

    await addProfileMutation.mutateAsync({
      profileName: userName,
    });

    await utils.userRouter.getAllProfiles.invalidate();
    setUserName("");
  };

  return (
    <div className="w-full max-w-4xl text-left">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Learners
        </h1>
        <p className="mt-2 max-w-prose text-base text-stone-600">
          Profiles allow a user to manage multiple learners.
        </p>
      </header>

      <section className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-5 sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight text-stone-900">
          Add a learner
        </h2>
        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            void handleAddProfile();
          }}
        >
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="profileName">Profile name</Label>
            <Input
              type="text"
              id="profileName"
              placeholder="Profile name"
              value={userName}
              onChange={handleUserNameChange}
            />
          </div>
          <Button
            type="submit"
            disabled={!userName.trim() || addProfileMutation.isLoading}
            className="shrink-0 bg-green-700 text-white hover:bg-green-800 focus-visible:ring-green-700"
          >
            Add profile
          </Button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="border-b pb-2 text-xl font-semibold tracking-tight text-stone-900">
          Profiles
        </h2>
        {(allProfiles?.length ?? 0) === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-stone-300 px-4 py-6 text-center text-sm text-stone-500">
            No profiles yet. Add the first learner above.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Min Word Count</TableHead>
                  <TableHead>Max Word Count</TableHead>
                  <TableHead>Sentence Award</TableHead>
                  <TableHead>Word Award</TableHead>
                  <TableHead>Confetti Word Target</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allProfiles?.map((profile) => (
                  <ProfileRow key={profile.id} profile={profile} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <p className="mt-3 text-xs text-stone-500">
          Click a value in the table to edit it. The active learner is
          highlighted.
        </p>
      </section>
    </div>
  );
}
