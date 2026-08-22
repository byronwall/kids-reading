import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { WordQuestionPractice } from "./WordQuestionPractice";
import { SentenceQuestionPractice } from "./SentenceQuestionPractice";

export function QuestionPractice() {
  return (
    <Tabs defaultValue="sentences" className="w-full">
      <div className="flex justify-center">
        <TabsList>
          <TabsTrigger value="sentences">Sentences</TabsTrigger>
          <TabsTrigger value="words">Words</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="sentences" className="mt-6">
        <SentenceQuestionPractice />
      </TabsContent>
      <TabsContent value="words" className="mt-6">
        <WordQuestionPractice />
      </TabsContent>
    </Tabs>
  );
}
