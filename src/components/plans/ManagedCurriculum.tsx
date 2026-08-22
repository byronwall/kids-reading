"use client";

import { ButtonLoading } from "~/components/common/ButtonLoading";
import { Icons } from "~/components/common/icons";
import { cn } from "~/lib/utils";
import { useLessonActions } from "~/hooks/useLessonActions";
import { useActiveProfile } from "~/hooks/useActiveProfile";
import { type DetailedLearningPlan } from "~/types/models";

import type { KeyboardEvent } from "react";

type Plan = DetailedLearningPlan;
type Chunk = Plan["chunks"][number];
type Lesson = Chunk["lessons"][number];

function humanizePattern(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function scoreLabel(lesson: Lesson) {
  const good = lesson.words.reduce((total, word) => total + word.goodCount, 0);
  const bad = lesson.words.reduce((total, word) => total + word.badCount, 0);
  return { good, bad };
}

function chunkScoreLabel(chunk: Chunk) {
  return chunk.lessons.reduce(
    (score, lesson) => {
      const lessonScore = scoreLabel(lesson);
      return { good: score.good + lessonScore.good, bad: score.bad + lessonScore.bad };
    },
    { good: 0, bad: 0 }
  );
}

function handleDisclosureKeyDown(event: KeyboardEvent<HTMLElement>) {
  if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;

  event.preventDefault();
  event.currentTarget.parentElement?.toggleAttribute("open");
}

function WordList({ label, words }: { label: string; words: Lesson["targetWords"] }) {
  if (words.length === 0) return null;
  return (
    <div>
      <h5 className="text-sm font-semibold text-slate-700">{label}</h5>
      <ul className="mt-1 flex flex-wrap gap-2" aria-label={label}>
        {words.map((word) => (
          <li key={`${label}-${word.id}`} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-800">
            {word.word}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ManagedLesson({ lesson, showProgress }: { lesson: Lesson; showProgress: boolean }) {
  const { good, bad } = scoreLabel(lesson);
  const focus = lesson.ProfileLessonFocus[0];
  const { handleToggleFocus, handleLinkProfileToLesson, isLoadingLinkProfileToLesson, isLoadingToggleFocus } = useLessonActions(lesson.id);
  const hasLinkedProfile = focus?.profileId != null;

  return (
    <details id={`lesson-${lesson.id}`} className="group border-t border-slate-200 py-4 first:border-t-0">
      <summary onKeyDown={handleDisclosureKeyDown} className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-2 rounded-md px-2 py-1 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 [&::-webkit-details-marker]:hidden">
        <span className="w-8 text-sm font-semibold text-slate-500">{lesson.order}.</span>
        <h4 className="min-w-[12rem] flex-1 text-lg font-semibold text-slate-950">{lesson.name}</h4>
        {lesson.difficulty != null && <span className="text-sm text-slate-600">Level {lesson.difficulty}</span>}
        {showProgress && <span className="text-sm font-medium text-slate-700" aria-label={`Score plus ${good}, minus ${bad}`}>
          <span className="text-emerald-700">+{good}</span> <span className={cn(bad > 0 && "text-rose-700")}>−{bad}</span>
        </span>}
        {showProgress && focus?.isFocused && <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">Current</span>}
        <span aria-hidden className="text-slate-500 transition-transform group-open:rotate-180">⌄</span>
      </summary>

      <div className="mt-4 grid gap-5 pl-10 pr-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {!showProgress && <p className="text-sm text-slate-600">Select a learner to track progress.</p>}
            {showProgress && !hasLinkedProfile && (
              <ButtonLoading variant="outline" size="sm" onClick={handleLinkProfileToLesson} isLoading={isLoadingLinkProfileToLesson}>
                <Icons.userPlus className="mr-1 h-4 w-4" /> Start this lesson
              </ButtonLoading>
            )}
            {showProgress && hasLinkedProfile && (
              <ButtonLoading variant="outline" size="sm" onClick={() => handleToggleFocus(!focus?.isFocused)} isLoading={isLoadingToggleFocus}>
                <Icons.star fill={focus?.isFocused ? "currentColor" : "none"} className="mr-1 h-4 w-4 text-yellow-500" />
                {focus?.isFocused ? "Current lesson" : "Set as current"}
              </ButtonLoading>
            )}
          </div>
          {lesson.focus && <p className="text-sm text-slate-700">Focus: {humanizePattern(lesson.focus)}</p>}
          {lesson.targetPatterns.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-slate-700">Target patterns</h5>
              <p className="mt-1 text-sm text-slate-700">{lesson.targetPatterns.map(humanizePattern).join(", ")}</p>
            </div>
          )}
          <WordList label="Target words" words={lesson.targetWords} />
          <WordList label="Review words" words={lesson.reviewWords} />
          {lesson.prerequisites.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-slate-700">Prerequisites</h5>
              <p className="mt-1 text-sm text-slate-700">{lesson.prerequisites.map((item) => item.name).join(", ")}</p>
            </div>
          )}
          {lesson.reviewSources.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-slate-700">Reviews</h5>
              <p className="mt-1 text-sm text-slate-700">{lesson.reviewSources.map((item) => item.name).join(", ")}</p>
            </div>
          )}
          {lesson.teacherNote && (
            <details className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
              <summary onKeyDown={handleDisclosureKeyDown} className="cursor-pointer text-sm font-medium text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600">Teacher Note</summary>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{lesson.teacherNote}</p>
            </details>
          )}
        </div>
        <div>
          <h5 className="text-sm font-semibold text-slate-700">Practice sentences</h5>
          {lesson.sentences.length > 0 ? (
            <ol className="mt-1 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-800">
              {lesson.sentences.map((sentence) => <li key={sentence.id}>{sentence.fullSentence}</li>)}
            </ol>
          ) : (
            <p className="mt-1 text-sm text-slate-500">No authored sentences yet.</p>
          )}
        </div>
      </div>
    </details>
  );
}

export function ManagedCurriculum({ plan }: { plan: Plan }) {
  const { activeProfile } = useActiveProfile();
  const showProgress = Boolean(activeProfile?.id);
  const currentChunkId = plan.chunks.find((chunk) =>
    showProgress && chunk.lessons.some((lesson) => lesson.ProfileLessonFocus[0]?.isFocused)
  )?.id ?? plan.chunks[0]?.id;

  return (
    <section aria-labelledby="curriculum-heading" className="mt-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="curriculum-heading" className="text-2xl font-semibold text-slate-950">Curriculum</h2>
          <p className="mt-1 text-sm text-slate-600">Work through each chunk in order. Open a lesson for words and practice.</p>
        </div>
      </div>
      <div className="space-y-8">
        {plan.chunks.length > 0 ? plan.chunks.map((chunk) => <ChunkSection key={chunk.id} chunk={chunk} defaultOpen={chunk.id === currentChunkId} showProgress={showProgress} />) : (
          <p className="rounded-md border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-600">No curriculum chunks are available yet.</p>
        )}
      </div>
    </section>
  );
}

function ChunkSection({ chunk, defaultOpen, showProgress }: { chunk: Chunk; defaultOpen: boolean; showProgress: boolean }) {
  const goals = chunk.goals;
  const score = chunkScoreLabel(chunk);
  return (
    <section aria-labelledby={`chunk-${chunk.id}`} className="border-b border-slate-300 pb-7">
      <details open={defaultOpen} className="group">
        <summary onKeyDown={handleDisclosureKeyDown} className="flex cursor-pointer list-none flex-wrap items-start justify-between gap-3 rounded-md px-2 py-1 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 [&::-webkit-details-marker]:hidden">
          <div>
            <h3 id={`chunk-${chunk.id}`} className="text-xl font-semibold text-slate-950">{chunk.order}. {chunk.title}</h3>
          </div>
          <div className="flex items-center gap-3">
            {showProgress && <span className="text-sm font-medium text-slate-700" aria-label={`Chunk score plus ${score.good}, minus ${score.bad}`}>
              <span className="text-emerald-700">+{score.good}</span> <span className={cn(score.bad > 0 && "text-rose-700")}>−{score.bad}</span>
            </span>}
            {chunk.difficulty != null && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">Difficulty {chunk.difficulty}</span>}
            <span aria-hidden className="text-slate-500 transition-transform group-open:rotate-180">⌄</span>
          </div>
        </summary>
        <div className="mt-3">
          {goals.length > 0 && <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-700">{goals.map((goal) => <li key={goal}>{goal}</li>)}</ul>}
          <div className="border-y border-slate-200 px-1">
            {chunk.lessons.length > 0 ? chunk.lessons.map((lesson) => <ManagedLesson key={lesson.id} lesson={lesson} showProgress={showProgress} />) : (
              <p className="px-2 py-5 text-sm text-slate-600">No lessons are available in this chunk.</p>
            )}
          </div>
        </div>
      </details>
    </section>
  );
}
