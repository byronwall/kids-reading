import { prisma } from "~/server/db";
import { getProfileWordCount } from "~/server/api/routers/awardRouter";

export async function processWordCountAwards(profileId: string) {
  // get the word count
  // check the user's current max word count award
  // create awards for every 100 words completed
  const wordCount = await getProfileWordCount(profileId);

  const currentMaxWordCountAward = await prisma.profileAward.findFirst({
    where: {
      profileId,
      awardType: "WORD_COUNT",
    },

    orderBy: {
      awardValue: "desc",
    },
  });

  // get the award threshold for profile
  const wordThresholdForAward = await prisma.profile.findUnique({
    where: {
      id: profileId,
    },
    select: {
      wordThresholdForAward: true,
    },
  });

  const threshold = wordThresholdForAward?.wordThresholdForAward ?? 100;

  const currentMaxWordCount = currentMaxWordCountAward?.awardValue ?? 0;

  const newAwardsToCreate = [];

  for (
    let wordCountAward = currentMaxWordCount + threshold;
    wordCountAward <= wordCount;
    wordCountAward += threshold
  ) {
    newAwardsToCreate.push({
      profileId,
      awardType: "WORD_COUNT",
      awardValue: wordCountAward,
    });
  }

  await prisma.profileAward.createMany({
    data: newAwardsToCreate,
  });
}
