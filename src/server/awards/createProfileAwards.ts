import { processWordMasteryAwards } from "./processWordMasteryAwards";
import { processWordCountAwards } from "./processWordCountAwards";
import { processSentenceCountAwards } from "./processSentenceCountAwards";

export async function createProfileAwards(profileId: string) {
  // run in parallel
  await Promise.all([
    processWordCountAwards(profileId),
    processSentenceCountAwards(profileId),
    processWordMasteryAwards(profileId),
  ]);
}
