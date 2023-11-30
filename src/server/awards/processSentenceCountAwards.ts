import { prisma } from "~/server/db";
import { getProfileSentenceCount } from "~/server/api/routers/awardRouter";

export async function processSentenceCountAwards(profileId: string) {
  // do the same thing for sentence count
  const sentenceCount = await getProfileSentenceCount(profileId);

  const currentMaxSentenceCountAward = await prisma.profileAward.findFirst({
    where: {
      profileId,
      awardType: "SENTENCE_COUNT",
    },

    orderBy: {
      awardValue: "desc",
    },
  });

  // get the award threshold for profile
  const sentenceThresholdForAward = await prisma.profile.findUnique({
    where: {
      id: profileId,
    },
    select: {
      sentenceThresholdForAward: true,
    },
  });

  const threshold = sentenceThresholdForAward?.sentenceThresholdForAward ?? 10;

  const currentMaxSentenceCount = currentMaxSentenceCountAward?.awardValue ?? 0;

  const newSentenceAwardsToCreate = [];

  for (
    let sentenceCountAward = currentMaxSentenceCount + threshold;
    sentenceCountAward <= sentenceCount;
    sentenceCountAward += threshold
  ) {
    newSentenceAwardsToCreate.push({
      profileId,
      awardType: "SENTENCE_COUNT",
      awardValue: sentenceCountAward,
    });
  }

  await prisma.profileAward.createMany({
    data: newSentenceAwardsToCreate,
  });
}
