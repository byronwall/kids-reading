"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { trpc } from "../_trpc/client";

export default function StatsPage() {
  // create sections for the results history and summary table

  const { data: userData, isLoading } =
    trpc.questionRouter.getUserStats.useQuery();

  const userResults = userData?.results ?? [];

  const userSummary = userData?.summaries ?? [];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Stats</h1>

      <h2>Results History</h2>

      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Good Words</TableHead> */}
            <TableHead>Bad Words</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Sentence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userResults.map((result, idx) => (
            <TableRow key={idx}>
              {/* <TableCell className="max-w-md">
                {result
                  .filter((c) => c.score > 50)
                  .map((r) => r.word?.word)
                  .join(", ")}
              </TableCell> */}
              <TableCell className="max-w-md font-semibold text-red-700">
                {result
                  .filter((c) => c.score < 50)
                  .map((r) => r.word?.word)
                  .join(", ")}
              </TableCell>
              <TableCell>{result[0]?.createdAt.toLocaleString()}</TableCell>
              <TableCell>
                {result[0]?.sentence?.fullSentence ?? result[0]?.word?.word}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2>Summary</h2>

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
              <TableCell>{summary.nextReviewDate.toLocaleString()}</TableCell>
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
    </div>
  );
}
