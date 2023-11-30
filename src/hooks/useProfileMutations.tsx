"use client";
import { trpc } from "~/lib/trpc/client";
import { type RouterInputs } from "~/utils/api";

export function useProfileMutations() {
  const utils = trpc.useContext();

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

  return { handleUpdateProfile };
}
