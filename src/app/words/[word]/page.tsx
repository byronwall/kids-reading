"use client";

import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getSyllables } from "~/lib/splitArpabet";

export default function WordPage() {
  const params = useParams();

  const word = params?.word ?? "";

  if (typeof word !== "string") {
    throw new Error("Word is not a string");
  }

  const { syllables, stressLevels, arpabet } = getSyllables(word);

  return (
    <div className="container mx-auto max-w-2xl">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>{word}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Arpabet:</strong> {arpabet}
          </p>
          <p>
            <strong>Syllables:</strong> {syllables.join(" · ")}
          </p>
          <p>
            <strong>Stress levels:</strong> {stressLevels.join(" · ")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
