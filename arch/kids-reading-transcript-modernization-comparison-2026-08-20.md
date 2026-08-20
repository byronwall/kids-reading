# Kids Reading App: Transcript vs Repository Comparison

Date: 2026-08-20
Source transcript: `/Users/byronwall/.v2c-voice-memos/20260720-204915-B89B1E9A-context/transcript/transcript.txt`

## Executive summary
The repo already implements much of the original concept: spaced repetition, sentence-based and word-based practice, lesson planning, and a reward loop. It does not yet match several transcript priorities around iOS delivery, stronger parent analytics, irregular-word suppression, and the admin/engagement modernization you requested.

## Transcript requirements (high-level)
- Mobile-first practice with parent-managed kids/profiles
- Spaced repetition with overdue words resurfacing faster
- Sentences generated around current weak words and tuned by level
- Better progress visuals and improved admin flow
- Lesson planning to guide what comes next
- Reward system for word count, sentence count, and mastery
- Easy flagging/removal of hard words (irregular words)
- Notifications/reminders for engagement
- Potential native iOS productization

## What the repo already covers
### 1) Core SRS and practice loop is present
- Word interval/difficulty updates are implemented with score-based interval growth/shrink and review date scheduling.
  - `src/server/api/routers/questionRouter.ts` (`submitResultAndUpdateSummary` logic)
- Current review queue is driven by due words and sentence scoring includes focused words, due weight, and overdue weighting.
  - `src/server/api/routers/questionRouter.ts` (`getPossibleSentences`, `getScheduledQuestions`, `getFocusedWords`)
- Practice surfaces both word and sentence flows with tappable words and font controls.
  - `src/components/questions/WordQuestionPractice.tsx`
  - `src/components/questions/SentenceQuestionPractice.tsx`

### 2) Multi-profile parent management exists
- Profile model + active-profile switching and threshold settings are present.
  - `src/server/auth.ts`
  - `src/hooks/useActiveProfile.ts`
  - `src/app/user/page.tsx`
  - `src/components/user/ProfileRow.tsx`

### 3) Lesson/planning architecture is implemented
- Learning plans, lessons, words, and focus flags exist in schema and router APIs.
  - `src/server/api/routers/planRouter.ts`
- UI links lessons to profiles and marks focused state.
  - `src/components/plans/LearningPlanCard.tsx`
  - `src/components/plans/LessonDetail.tsx`

### 4) Sentence and word generation integration is in place
- GPT generation with adjustable flags and controlled prompt settings; results can be inserted into sentence DB.
  - `src/server/openai/generations.ts`
  - `src/server/api/routers/sentencesRouter.ts`
  - `src/components/sentences/SentenceCreatorForm.tsx`

### 5) Reward loop exists
- Awards are created on result submission and claimable with images.
  - `src/server/awards/createProfileAwards.ts`
  - `src/server/awards/processWordCountAwards.ts`
  - `src/server/awards/processSentenceCountAwards.ts`
  - `src/server/awards/processWordMasteryAwards.ts`
  - `src/app/awards/page.tsx`
  - `src/app/awards/AwardsForProfile.tsx`

## Gaps vs transcript priorities
### Critical
1) No native iOS app path
- No React Native/Expo/Cocoa/iOS surface is present in codebase.
- Search/structure shows only web app files under `src/` and no mobile framework scaffolding.

2) Parent/child admin and progress UX is underdone
- Admin home is placeholder only.
  - `src/app/admin/page.tsx`
- Stats page exists but lacks consolidated decision support (guided next actions, trend dashboards).
  - `src/app/stats/page.tsx`
  - `src/components/stats/StatsDetail.tsx`

3) No robust irregular-word handling
- Transcript mentions needing “skip/banish” controls for hard words.
- Current system only hard deletes words/sentences.
  - `src/server/api/routers/wordRouter.ts`
  - `src/server/api/routers/sentencesRouter.ts`
  - `src/server/api/routers/questionRouter.ts`

4) Lesson workflow still requires more intentional scaffolding
- Plans and lesson controls exist, but no completion coaching, sequencing recommendations, or mastery-level progression guidance.
  - `src/components/plans/*`

5) No reminders/notifications implemented
- No email/push scheduler, no nudge pipeline, no scheduled reminders.

### Important
6) Sentence generation quality control is light
- Prompting is present, but there is no formal reading-level validator beyond prompt text, and no phonics-level analytics loop.
  - `src/server/openai/generations.ts`

7) Analytics and performance gaps
- Parent reporting is basic; aggregate trend views and comparative summaries are limited.
  - `src/app/stats/page.tsx`
  - `src/components/stats/StatsDetail.tsx`
- Large sentence list scoring/sorting can become costly as data scales.
  - `src/server/api/routers/questionRouter.ts`

8) Modernization debt
- Still on older app stack and older setup commands (e.g., Next 13.5.2).
  - `package.json`

## Recommended modernization work list
### P0 (required to match transcript intent)
- Build iOS-native or installable mobile-first shell for one-hand reading flow.
- Add per-profile “pause/skip” word flag and lesson-level blocklist for irregular words.
- Replace admin home with actionable dashboard and quick actions.

### P1 (near-term quality)
- Improve sentence quality pipeline with deterministic post-checks and readability/phonics checks.
- Add parent-facing progress scorecards: backlog by plan, weak-word concentration, and suggested next lesson.

### P2 (retention)
- Add reminders (email/push) and streak/target logic.
- Add richer award progress states before reward claim flow.

### P3 (platform stability)
- Strengthen schema constraints (`Sentence.metaInfo`, lesson completion state), add migration-safe indexes for review queries, and modernize dependencies.

## Evidence bundle
I also added a transcript appendix in this repo:
- `arch/transcripts/kids-reading-transcript-2026-07-20.md`

No commit was made (as requested).
