import { type Profile } from "@prisma/client";
import { useSession } from "next-auth/react";

import { trpc } from "~/app/_trpc/client";

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

  return {
    activeProfile: session?.user.activeProfile,
    setActiveProfile: handleSetActiveProfile,
  };
}
