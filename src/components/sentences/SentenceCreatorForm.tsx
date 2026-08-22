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
import { ButtonLoading } from "~/components/common/ButtonLoading";
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
import { Icons } from "~/components/common/icons";
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

const iconButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-amber-50 hover:text-amber-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700";

type Props = {
  initialWordTargets?: string[];
};

export function SentenceCreatorForm(props: Props) {
  const { initialWordTargets } = props;

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
  }, [form, form.setValue, initialWordTargets]);

  const createNewSentencesMutation =
    trpc.sentencesRouter.getGptSentences.useMutation();

  const __rawWordGroups = form.watch("__rawWordGroups");

  useEffect(() => {
    const wordGroups = (__rawWordGroups ?? "").split("\n").map((line) =>
      line
        .trim()
        .split(/\s+/)
        .map((word) => word.trim())
    );

    form.setValue("wordGroups", wordGroups);
  }, [form, form.setValue, __rawWordGroups]);

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

  const handleShuffleGroups = () => {
    const newLocal = form.getValues("wordGroups");
    // shuffle into new groups of 3

    const words =
      newLocal?.flatMap((group) => group.flatMap((c) => c.split(" "))) ?? [];

    words.sort(() => Math.random() - 0.5);

    const groups: string[][] = [];

    while (words.length > 0) {
      groups.push(words.splice(0, 3));
    }

    form.setValue(
      "__rawWordGroups",
      groups.map((group) => group.join(" ")).join("\n")
    );
  };

  const handleCombineWords = () => {
    const newLocal = form.getValues("wordGroups");

    const newGroups = newLocal?.flatMap((group) => group) ?? [];

    newGroups.sort(() => Math.random() - 0.5);

    form.setValue("__rawWordGroups", newGroups.join(" "));
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.5fr_1fr]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="__rawWordGroups"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-wrap items-center gap-2">
                  <FormLabel>Word List</FormLabel>
                  <button
                    type="button"
                    onClick={handleShuffleGroups}
                    aria-label="Shuffle words into groups of three"
                    title="Shuffle into groups of three"
                    className={iconButtonClass}
                  >
                    <Icons.shuffle className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCombineWords}
                    aria-label="Combine all words into one list"
                    title="Combine into one list"
                    className={iconButtonClass}
                  >
                    <Icons.combine className="h-4 w-4" />
                  </button>
                </div>
                <FormControl>
                  <Textarea placeholder="Words" {...field} />
                </FormControl>
                <FormDescription>
                  Add words separated by spaces. Put on lines to group.
                </FormDescription>
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
                      <SelectValue placeholder="Select a reading level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[240px] overflow-y-auto">
                    {Object.entries(readingLevelExamples).map(
                      ([level, example]) => (
                        <SelectItem key={level} value={level}>
                          <div className="flex items-center gap-4 py-1">
                            <span className="font-bold">{level}</span>
                            <span className="text-sm text-stone-600">{example}</span>
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
                <div className="flex flex-wrap items-center gap-2">
                  <FormLabel>Number of sentences</FormLabel>
                  <FormDescription>
                    Will be ignored if you supply multiple word groups.
                  </FormDescription>
                </div>
                <Input type="number" min={1} {...field} className="max-w-[8rem]" />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="includeProperNames"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-stone-200 bg-white p-4 transition-colors focus-within:border-amber-300 hover:border-amber-300">
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
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-stone-200 bg-white p-4 transition-colors focus-within:border-amber-300 hover:border-amber-300">
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
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-stone-200 bg-white p-4 transition-colors focus-within:border-amber-300 hover:border-amber-300">
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

          <ButtonLoading isLoading={isLoadingSentences} type="submit" className="bg-green-700 text-white hover:bg-green-800 focus-visible:ring-green-700">
            <span>Get sentences</span>
          </ButtonLoading>
        </form>
      </Form>
      <div className="max-h-[80vh] overflow-y-auto pr-1">
        <h3 className="text-base font-semibold tracking-tight text-stone-900">
          Results
        </h3>
        <div className="mt-3">
          {isLoadingSentences && (
            <p className="flex items-center gap-2 text-sm text-stone-500" role="status">
              <Icons.spinner className="h-4 w-4 animate-spin" />
              Generating…
            </p>
          )}
          {!isLoadingSentences && newSentences?.length == 0 && (
            <p className="rounded-lg border border-dashed border-stone-300 px-3 py-6 text-center text-sm text-stone-500">
              No sentences yet
            </p>
          )}
          {!isLoadingSentences && newSentences?.length > 0 && (
            <div>
              <div>
                <ButtonLoading
                  onClick={() => handleAddSentences(newSentences)}
                  isLoading={isAddingSentences}
                  variant="outline"
                  size="sm"
                >
                  Add all sentences
                </ButtonLoading>
              </div>
              <ul className="mt-3 flex flex-col gap-2">
                {newSentences?.map((sentence) => (
                  <li
                    key={sentence}
                    className="group flex flex-1 items-center justify-between gap-2 rounded-md border border-stone-200 px-3 py-2 transition-colors hover:border-amber-300 hover:bg-amber-50/60"
                  >
                    <span className="text-base text-stone-800 group-hover:text-amber-950">{sentence}</span>
                    <div className="flex shrink-0 items-center">
                      <ButtonLoading
                        onClick={() => handleAddSingleSentence(sentence)}
                        isLoading={isAddingSentences}
                        aria-label={`Add sentence: ${sentence}`}
                        title="Add this sentence"
                        size="sm"
                        variant="ghost"
                        className="h-9 w-9 p-0 text-green-700 hover:bg-green-50 hover:text-green-800"
                      >
                        <Icons.add className="h-5 w-5" />
                      </ButtonLoading>
                      <button
                        type="button"
                        onClick={() => handleRemoveSentence(sentence)}
                        aria-label={`Discard generated sentence: ${sentence}`}
                        title="Discard this sentence"
                        className={`${iconButtonClass} hover:bg-rose-50 hover:text-rose-700`}
                      >
                        <Icons.trash className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
