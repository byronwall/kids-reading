import { type Profile } from "@prisma/client";
import { useSession } from "next-auth/react";

import { trpc } from "~/lib/trpc/client";

export function useActiveProfile() {
  const { data: session, update } = useSession();

  const utils = trpc.useContext();

  const handleSetActiveProfile = async (profile: Profile) => {
    await update({
      activeProfile: profile,
    });

    // ensure that all profile specific data is re-queried
    await utils.invalidate();
  };

  // load session from server instead of relying on JWT
  const { data: activeProfileDb } = trpc.userRouter.getActiveProfile.useQuery();

  return {
    activeProfile: activeProfileDb ?? session?.user.activeProfile,
    setActiveProfile: handleSetActiveProfile,
  };
}
