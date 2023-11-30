import { prisma } from "~/server/db";

export async function processWordMasteryAwards(profileId: string) {
  // find any words that have a interval >= 60
  // check if the current user has awards for those words
  // create awards for those words
  const wordsWithMastery = await prisma.profileWordSummary.findMany({
    where: {
      profileId,
      interval: {
        gte: 60,
      },
    },
    include: {
      word: true,
    },
  });

  const wordIdsWithMastery = wordsWithMastery.map((word) => word.wordId);

  const existingAwards = await prisma.profileAward.findMany({
    where: {
      profileId,
      awardType: "WORD_MASTERY",
      wordId: {
        in: wordIdsWithMastery,
      },
    },
  });

  const existingAwardWordIds = existingAwards.map((award) => award.wordId);

  const newAwardsToCreate = wordsWithMastery
    .filter((word) => !existingAwardWordIds.includes(word.wordId))
    .map((word) => ({
      profileId,
      awardType: "WORD_MASTERY",
      awardValue: 1,
      wordId: word.wordId,
    }));

  await prisma.profileAward.createMany({
    data: newAwardsToCreate,
  });
}
