import { type Profile } from "@prisma/client";
import { useSession } from "next-auth/react";

export function useActiveProfile() {
  const { data: session, update } = useSession();

  const handleSetActiveProfile = async (profile: Profile) => {
    await update({
      activeProfile: profile,
    });
  };

  return {
    activeProfile: session?.user.activeProfile,
    setActiveProfile: handleSetActiveProfile,
  };
}
