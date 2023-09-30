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
              <div className="grid w-full max-w-sm items-center gap-1.5">
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
            <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
              {allProfiles?.map((profile) => (
                <li
                  key={profile.id}
                  className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                >
                  <div className="flex w-0 flex-1 items-center">
                    <span
                      className={cn("ml-2 w-0 flex-1 truncate", {
                        "bg-slate-400": profile.id === activeProfile?.id,
                      })}
                    >
                      {profile.name}
                    </span>
                    <Button
                      type="button"
                      onClick={() => {
                        void setActiveProfile(profile);
                      }}
                      className="ml-2"
                    >
                      Set Active
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
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
