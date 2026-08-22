"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { useQuerySsr } from "~/hooks/useQuerySsr";
import { trpc } from "~/lib/trpc/client";
import { useSentenceCreatorStore } from "~/stores/sentenceCreatorStore";
import { getRelativeTime } from "~/lib/getRelativeTime";


export function StatsDetail() {
  const { data: userData, isLoading } = useQuerySsr(
    trpc.questionRouter.getUserStats
  );

  const userResults = userData?.results ?? [];

  const userSummary = userData?.summaries ?? [];

  const openWithTargetWords = useSentenceCreatorStore(
    (state) => state.openWithTargetWords
  );

  const handleNewSentences = () => {
    // get the 12 words that are most behind and create 4 sentences using 3 of them
    const words = userSummary.slice(0, 10 * 3) ?? [];

    const groupedWords = [];

    for (let i = 0; i < words.length; i++) {
      const addIdx = Math.floor(i / 3);

      if (!groupedWords[addIdx]) {
        groupedWords[addIdx] = "";
      }

      groupedWords[addIdx] += words[i]?.word?.word + " ";
    }

    openWithTargetWords(groupedWords);
  };

  return (
    <div className="w-full max-w-5xl text-left">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Stats
        </h1>
        <p className="mt-2 max-w-prose text-base text-stone-600">
          Recent practice results and where each word stands in its review
          schedule.
        </p>
      </header>

      {isLoading ? (
        <div role="status" className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-stone-100" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <Card className="rounded-xl border-stone-200 shadow-sm">
            <CardHeader>
              <CardTitle>Results summary</CardTitle>
              <CardDescription>
                Recent sentences and the words that were missed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Missed Words</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Sentence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userResults.length === 0 && (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={3} className="py-8 text-center text-sm text-stone-500">
                          No practice results yet. Results appear here after practice on the home page.
                        </TableCell>
                      </TableRow>
                    )}
                    {userResults.map((result, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium text-rose-700">
                          {result
                            .filter((c) => c.score < 50)
                            .map((r) => r.word?.word)
                            .join(", ") || "—"}
                        </TableCell>
                        <TableCell
                          className="whitespace-nowrap text-stone-600"
                          title={result[0]?.createdAt.toLocaleString()}
                        >
                          {getRelativeTime(result[0]?.createdAt)}
                        </TableCell>
                        <TableCell className="text-stone-800">
                          {result[0]?.sentence?.fullSentence ?? result[0]?.word?.word}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-stone-200 shadow-sm">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>Word results and schedule</CardTitle>
                  <CardDescription>
                    All words with their counts and next review date.
                  </CardDescription>
                </div>
                <Button
                  onClick={handleNewSentences}
                  disabled={userSummary.length === 0}
                  className="bg-green-700 text-white hover:bg-green-800 focus-visible:ring-green-700"
                >
                  Create sentences from weakest words
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Word</TableHead>
                      <TableHead>Next Review Date</TableHead>
                      <TableHead>Interval</TableHead>
                      <TableHead>Good / Bad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userSummary.length === 0 && (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={4} className="py-8 text-center text-sm text-stone-500">
                          No tracked words yet.
                        </TableCell>
                      </TableRow>
                    )}
                    {userSummary.map((summary) => (
                      <TableRow key={summary.id}>
                        <TableCell className="font-medium text-stone-900">
                          {summary.word?.word}
                        </TableCell>
                        <TableCell
                          className="whitespace-nowrap text-stone-600"
                          title={summary.nextReviewDate.toLocaleString()}
                        >
                          {getRelativeTime(summary.nextReviewDate)}
                        </TableCell>
                        <TableCell className="tabular-nums text-stone-600">
                          {summary.interval}d
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium tabular-nums">
                            {summary.goodCount > 0 && (
                              <span className="text-green-700">
                                +{summary.goodCount}
                              </span>
                            )}
                            {summary.badCount > 0 && (
                              <span className="text-rose-700">
                                −{summary.badCount}
                              </span>
                            )}
                            {summary.goodCount === 0 && summary.badCount === 0 && (
                              <span className="text-stone-400">—</span>
                            )}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
