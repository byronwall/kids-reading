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
            <TableHead>Word</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Sentence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userResults.map((result) => (
            <TableRow key={result.id}>
              <TableCell>{result.word?.word}</TableCell>
              <TableCell>{result.score}</TableCell>
              <TableCell>{result.createdAt.toLocaleString()}</TableCell>
              <TableCell>{result.sentence?.fullSentence}</TableCell>
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {userSummary.map((summary) => (
            <TableRow key={summary.id}>
              <TableCell>{summary.word?.word}</TableCell>
              <TableCell>{summary.nextReviewDate.toLocaleString()}</TableCell>
              <TableCell>{summary.interval}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
