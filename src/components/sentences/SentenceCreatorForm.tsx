"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ButtonLoading } from "~/components/ButtonLoading";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { GptSentenceSchema } from "~/server/api/routers/inputSchemas";
import { trpc } from "~/lib/trpc/client";
import { Checkbox } from "~/components/ui/checkbox";
import { Icons } from "~/components/icons";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { useSentenceAdder } from "~/hooks/useSentenceAdder";

import type * as z from "zod";

const FormSchema = GptSentenceSchema;

const readingLevelExamples = {
  A: "I see a cat.",
  B: "The dog is running.",
  C: "She likes to eat ice cream.",
  D: "The boy is playing with a ball.",
  E: "The children went to the park today.",
  F: "The teacher gave us homework for the weekend.",
  G: "My little sister is afraid of the dark.",
  H: "The circus has elephants, lions, and clowns.",
  I: "During winter, it's important to wear a warm coat.",
  J: "The soccer game was canceled due to the rain.",
  K: "Mary enjoyed the chocolate cake at the birthday party.",
  L: "After school, Jenny usually goes to the library to read.",
  M: "The concert was amazing, especially the guitar solo.",
  N: "Astronauts wear special suits to protect them in space.",
  O: "The museum featured artifacts from ancient civilizations.",
  P: "Many animals are becoming endangered because of habitat loss.",
  Q: "Although he practiced hard, he couldn't win the chess tournament.",
  R: "Despite the stormy weather, they managed to complete the race.",
  S: "The scientist carefully recorded observations during the experiment.",
  T: "The musician's skill was apparent through the complexity of the composition.",
  U: "Due to climate change, glaciers are melting at an alarming rate.",
  V: "The politician's speech was met with both praise and criticism.",
  W: "In the realm of classical music, Beethoven's compositions are highly regarded.",
  X: "The economic disparity between social classes continues to grow.",
  Y: "Advancements in technology have revolutionized the medical field.",
  Z: "Existential questions often concern the nature of life, freedom, and choice.",
};

type Props = {
  initialWordTargets?: string[];
};

export function SentenceCreatorForm(props: Props) {
  const { initialWordTargets } = props;

  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      __rawWordGroups: "",
      wordGroups: [],
      readingLevel: "I",
      numberOfSentences: 10,
      includeAlliteration: false,
      includeProperNames: false,
      includeRhyming: false,
    },
  });

  useEffect(() => {
    if (initialWordTargets) {
      form.setValue("__rawWordGroups", initialWordTargets.join("\n"));
    }
  }, [form.setValue, initialWordTargets]);

  const createNewSentencesMutation =
    trpc.sentencesRouter.getGptSentences.useMutation();

  const __rawWordGroups = form.watch("__rawWordGroups");

  useEffect(() => {
    if (form.formState.touchedFields.__rawWordGroups) {
      const wordGroups = (__rawWordGroups ?? "").split("\n").map((line) =>
        line
          .trim()
          .split(/\s+/)
          .map((word) => word.trim())
      );

      form.setValue("wordGroups", wordGroups);
    }
  }, [__rawWordGroups, form.formState, form.setValue]);

  const [newSentences, setNewSentences] = useState<string[]>([]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const sentences = await createNewSentencesMutation.mutateAsync(data);

    setNewSentences(sentences);
  }

  const isLoadingSentences = createNewSentencesMutation.isLoading;

  const { handleAddSentences: sentenceMutater, isAddingSentences } =
    useSentenceAdder();

  const handleAddSentences = async (sentences: string[]) => {
    await sentenceMutater(sentences);

    setNewSentences([]);
  };

  const handleRemoveSentence = (sentence: string) => {
    setNewSentences((sentences) => sentences.filter((s) => s !== sentence));
  };

  const handleAddSingleSentence = async (sentence: string) => {
    await sentenceMutater([sentence]);

    setNewSentences((sentences) => sentences.filter((s) => s !== sentence));
  };

  return (
    <div className="grid  grid-cols-1 gap-4  md:grid-cols-[1.5fr,1fr]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="__rawWordGroups"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Word List</FormLabel>
                  <FormDescription>
                    Add words separated by spaces. Put on lines to group.
                  </FormDescription>
                </div>
                <FormControl>
                  <Textarea placeholder="Words" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="readingLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reading Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[240px] overflow-y-auto">
                    {Object.entries(readingLevelExamples).map(
                      ([level, example]) => (
                        <SelectItem
                          key={level}
                          value={level}
                          className="hover:bg-gray-100"
                        >
                          <div className="flex items-center gap-4 rounded-md  p-2 ">
                            <span className="font-bold">{level}</span>
                            <span className="text-sm">{example}</span>
                          </div>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfSentences"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Number of sentences</FormLabel>
                  <FormDescription>
                    Will be ignored if you supply multiple word groups.
                  </FormDescription>
                </div>
                <Input type="number" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="includeProperNames"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Include proper names (e.g. "John", "Mary", "New York")
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="includeRhyming"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Include rhyming words (e.g. "cat", "hat", "sat")
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="includeAlliteration"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="leading-none">
                  <FormLabel>
                    Include alliteration (e.g. "Peter Piper picked peppers")
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <ButtonLoading isLoading={isLoadingSentences} type="submit">
            <span>Get sentences</span>
          </ButtonLoading>
        </form>
      </Form>
      <div className="max-h-[80vh] overflow-y-auto">
        <h2>Results</h2>
        <div>
          {isLoadingSentences && (
            <p>
              <Icons.spinner />{" "}
            </p>
          )}
          {!isLoadingSentences && newSentences?.length == 0 && (
            <p>No sentences yet</p>
          )}
          {!isLoadingSentences && newSentences?.length > 0 && (
            <div>
              <div>
                <ButtonLoading
                  onClick={() => handleAddSentences(newSentences)}
                  isLoading={isAddingSentences}
                >
                  Add all sentences
                  <Icons.add className="ml-2 h-5 w-5" />
                </ButtonLoading>
              </div>
              <div>
                {newSentences?.map((sentence) => (
                  <div
                    key={sentence}
                    className="flex flex-1 items-center justify-between rounded-md border p-2 hover:bg-gray-100"
                  >
                    <span className="text-base">{sentence}</span>
                    <div className="shrink-0">
                      <ButtonLoading
                        onClick={() => handleAddSingleSentence(sentence)}
                        isLoading={isAddingSentences}
                        className="text-green-500 hover:text-green-700"
                        size="sm"
                        variant="ghost"
                      >
                        <Icons.add className="h-5 w-5" />
                      </ButtonLoading>
                      <button
                        onClick={() => handleRemoveSentence(sentence)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Icons.trash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
