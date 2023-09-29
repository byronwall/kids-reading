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

import { getRelativeTime } from "./getRelativeTime";

import { trpc } from "../_trpc/client";
import { useSentenceCreatorStore } from "../_stores/sentenceCreatorStore";

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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-6">
      <h1>Stats</h1>
      <Card>
        <CardHeader>
          <CardTitle>Results Summary</CardTitle>
          <CardDescription>
            Recent sentences and words that were reported.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bad Words</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Sentence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userResults.map((result, idx) => (
                <TableRow key={idx}>
                  <TableCell className="max-w-md font-semibold text-red-700">
                    {result
                      .filter((c) => c.score < 50)
                      .map((r) => r.word?.word)
                      .join(", ")}
                  </TableCell>
                  <TableCell title={result[0]?.createdAt.toLocaleString()}>
                    {getRelativeTime(result[0]?.createdAt)}
                  </TableCell>
                  <TableCell>
                    {result[0]?.sentence?.fullSentence ?? result[0]?.word?.word}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Word Results and Schedule</CardTitle>
          <CardDescription>
            Shows all words, their aggregate counts, and next schedule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleNewSentences}>create sentences</Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Word</TableHead>
                <TableHead>Next Review Date</TableHead>
                <TableHead>Interval</TableHead>
                <TableHead>Good Count</TableHead>
                <TableHead>Bad Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userSummary.map((summary) => (
                <TableRow key={summary.id}>
                  <TableCell>{summary.word?.word}</TableCell>
                  <TableCell title={summary.nextReviewDate.toLocaleString()}>
                    {getRelativeTime(summary.nextReviewDate)}
                  </TableCell>
                  <TableCell>{summary.interval}d</TableCell>

                  <TableCell>
                    {summary.goodCount > 0 && summary.goodCount}
                  </TableCell>

                  <TableCell className="font-semibold text-red-700">
                    {summary.badCount > 0 && summary.badCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
