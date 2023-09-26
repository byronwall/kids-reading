"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

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
import { trpc } from "~/app/_trpc/client";
import { Checkbox } from "~/components/ui/checkbox";
import { type RouterInputs } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/icons";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";

import type * as z from "zod";

const FormSchema = GptSentenceSchema;

type Props = {};

type GptSettings = RouterInputs["sentencesRouter"]["getGptSentences"];

export function SentenceCreatorForm(props: Props) {
  const {} = props;

  const utils = trpc.useContext();

  const createLesson = trpc.planRouter.createLesson.useMutation();

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

  return (
    <div className="grid grid-cols-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="__rawWordGroups"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Word List</FormLabel>
                <FormControl>
                  <Textarea placeholder="Words" {...field} />
                </FormControl>
                <FormDescription>
                  Add words separated by commas. To put into groups, add a new
                  line between groups.
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
                <FormControl>
                  <Input placeholder="Level [A-Z]" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2">
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
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Include alliteration (e.g. "Peter Piper picked a peck of
                      pickled peppers")
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <ButtonLoading isLoading={createLesson.isLoading} type="submit">
            <span>Create</span>
          </ButtonLoading>
        </form>
      </Form>
      <div>
        <h2>Results</h2>
        <div>
          {isLoadingSentences && (
            <p>
              <Icons.spinner />{" "}
            </p>
          )}
          {!isLoadingSentences && newSentences?.length && (
            <div>
              <div>
                <Button onClick={() => handleAddSentences(newSentences)}>
                  Add all sentences
                  <Icons.add className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div>
                {newSentences?.map((sentence) => (
                  <div
                    key={sentence}
                    className="flex items-center justify-between"
                  >
                    <span>{sentence}</span>
                    <button
                      onClick={() => handleAddSentences([sentence])}
                      className="text-green-500 hover:text-green-700"
                    >
                      <Icons.add className="h-5 w-5" />
                    </button>
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
