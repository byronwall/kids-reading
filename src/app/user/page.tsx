"use client";

import { useState } from "react";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
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
    console.log(`User name is ${userName}`);

    await addProfileMutation.mutateAsync({
      profileName: userName,
    });

    await utils.userRouter.getAllProfiles.invalidate();
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Profiles</CardTitle>
          <CardDescription>
            Profiles allow a user to manage multiple learners.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <section>
            <form className="flex items-center gap-2">
              <div className="grid w-full  items-center gap-1.5">
                <Label htmlFor="profileName">Add profile name</Label>
                <Input
                  type="profileName"
                  id="profileName"
                  placeholder="ProfileName"
                  value={userName}
                  onChange={handleUserNameChange}
                />
              </div>
              <Button
                type="button"
                onClick={handleAddProfile}
                className="shrink-0"
              >
                Add Profile
              </Button>
            </form>
          </section>
          <section className="mt-8">
            <h3 className="mb-2 text-lg font-medium">Profiles</h3>
            <table className="divide-y divide-gray-200 border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-sm">Name</th>
                  <th className="px-4 py-2 text-sm">Min Word Count</th>
                  <th className="px-4 py-2 text-sm">Max Word Count</th>
                  <th className="px-4 py-2 text-sm">Sentence Award</th>
                  <th className="px-4 py-2 text-sm">Word Award</th>
                  <th className="px-4 py-2 text-sm">Confetti Word Target</th>
                  <th className="px-4 py-2 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allProfiles?.map((profile) => (
                  <ProfileRow key={profile.id} profile={profile} />
                ))}
              </tbody>
            </table>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
