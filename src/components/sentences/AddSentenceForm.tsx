"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { AddSentenceSchema } from "~/server/api/routers/inputSchemas";
import { Textarea } from "~/components/ui/textarea";
import { trpc } from "~/lib/trpc/client";

import type * as z from "zod";

const FormSchema = AddSentenceSchema;

export function AddSentenceForm() {
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const addSentencesMutation =
    trpc.sentencesRouter.addSentencesFromString.useMutation();

  const rawInput = form.watch("rawInput") ?? "";

  const newSentences = rawInput.split("\n").filter(Boolean);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await addSentencesMutation.mutateAsync(data);

    await utils.sentencesRouter.getAllSentences.invalidate();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-4">
        <FormField
          control={form.control}
          name="rawInput"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sentences</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={"The cat sat on the mat.\nThe dog ran fast."}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter sentences on new lines. See preview below.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {newSentences.length > 0 && (
          <div>
            <p className="text-sm font-medium text-stone-700">Preview</p>
            <ol className="mt-2 flex list-decimal flex-col gap-1.5 pl-5">
              {newSentences.map((sentence) => (
                <li
                  key={sentence}
                  className="rounded-md border border-amber-100 bg-amber-50/70 px-3 py-1.5 text-base text-amber-950"
                >
                  {sentence}
                </li>
              ))}
            </ol>
          </div>
        )}

        <ButtonLoading
          isLoading={addSentencesMutation.isLoading}
          type="submit"
          className="bg-green-700 text-white hover:bg-green-800 focus-visible:ring-green-700"
        >
          <span>Create</span>
        </ButtonLoading>
      </form>
    </Form>
  );
}
