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
import { useActiveProfile } from "~/hooks/useActiveProfile";
import { cn } from "~/lib/utils";
import { trpc } from "~/lib/trpc/client";
import { type RouterInputs } from "~/utils/api";

export default function UserPage() {
  const utils = trpc.useContext();

  const [userName, setUserName] = useState("");

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const addProfileMutation = trpc.userRouter.addProfile.useMutation();

  const { data: allProfiles } = trpc.userRouter.getAllProfiles.useQuery();

  const handleAddProfile = async () => {
    console.log(`User name is ${userName}`);

    await addProfileMutation.mutateAsync({
      profileName: userName,
    });

    await utils.userRouter.getAllProfiles.invalidate();
  };

  const updateProfileMutation = trpc.userRouter.updateProfile.useMutation();

  const handleUpdateProfile = async (
    id: string,
    data: Partial<RouterInputs["userRouter"]["updateProfile"]>
  ) => {
    await updateProfileMutation.mutateAsync({
      ...data,
      profileId: id,
    });

    await utils.userRouter.getAllProfiles.invalidate();
  };

  const { setActiveProfile, activeProfile } = useActiveProfile();

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
                  <th className="px-4 py-2 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allProfiles?.map((profile) => (
                  <tr key={profile.id}>
                    <td
                      className={cn(
                        "cursor-pointer py-3 pl-3 pr-4 text-sm underline",
                        {
                          "bg-slate-400": profile.id === activeProfile?.id,
                        }
                      )}
                      onClick={() => {
                        const newName = prompt("Enter new name", profile.name);
                        if (newName) {
                          void handleUpdateProfile(profile.id, {
                            profileName: newName,
                          });
                        }
                      }}
                    >
                      {profile.name}
                    </td>
                    <td
                      className="cursor-pointer py-3 pl-3 pr-4 text-sm underline"
                      onClick={() => {
                        const newMin = prompt(
                          "Enter new minimum word count",
                          String(profile.minimumWordCount)
                        );
                        if (newMin) {
                          void handleUpdateProfile(profile.id, {
                            minimumWordCount: parseInt(newMin),
                          });
                        }
                      }}
                    >
                      {profile.minimumWordCount}
                    </td>
                    <td
                      className="cursor-pointer py-3 pl-3 pr-4 text-sm underline"
                      onClick={() => {
                        const newMax = prompt(
                          "Enter new maximum word count",
                          String(profile.maximumWordCount)
                        );
                        if (newMax) {
                          void handleUpdateProfile(profile.id, {
                            maximumWordCount: parseInt(newMax),
                          });
                        }
                      }}
                    >
                      {profile.maximumWordCount}
                    </td>
                    <td className="py-3 pl-3 pr-4 text-sm">
                      <Button
                        type="button"
                        onClick={() => {
                          void setActiveProfile(profile);
                        }}
                        className="ml-2"
                      >
                        Set Active
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </CardContent>
      </Card>

      <h2>Manage Account</h2>
      {/* Add account management code here */}

      <h2>Change Password</h2>
      {/* Add password change code here */}
    </div>
  );
}
