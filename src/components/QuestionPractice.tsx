import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { WordQuestionPractice } from "./WordQuestionPractice";
import { SentenceQuestionPractice } from "./SentenceQuestionPractice";

export function QuestionPractice() {
  return (
    <div>
      <Tabs defaultValue="sentences">
        <TabsList>
          <TabsTrigger value="sentences">Sentences</TabsTrigger>
          <TabsTrigger value="words">Words</TabsTrigger>
        </TabsList>
        <TabsContent value="words">
          <WordQuestionPractice />
        </TabsContent>
        <TabsContent value="sentences">
          <SentenceQuestionPractice />
        </TabsContent>
      </Tabs>
    </div>
  );
}
