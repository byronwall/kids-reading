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
import { EditSentenceSchema } from "~/server/api/routers/inputSchemas";
import { Textarea } from "~/components/ui/textarea";
import { trpc } from "~/lib/trpc/client";

import type * as z from "zod";

const FormSchema = EditSentenceSchema;

type Props = {
  sentenceId: string;
  originalFullSentence: string;
};

export function EditSentenceForm({ sentenceId, originalFullSentence }: Props) {
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: sentenceId,
      newFullSentence: originalFullSentence,
    },
  });

  const rawInput = form.watch("newFullSentence") ?? "";

  const addSentencesMutation = trpc.sentencesRouter.editSentence.useMutation();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await addSentencesMutation.mutateAsync(data);

    await utils.sentencesRouter.getAllSentences.invalidate();
  }

  const isSameAsOriginal = rawInput === originalFullSentence;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="newFullSentence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New sentence</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                The previous sentence will be archived so all existing
                references are OK.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-600">
          <span className="font-medium">Original:</span>{" "}
          {originalFullSentence}
        </div>

        <ButtonLoading
          isLoading={addSentencesMutation.isLoading}
          disabled={isSameAsOriginal}
          type="submit"
          className="bg-green-700 text-white hover:bg-green-800 focus-visible:ring-green-700"
        >
          <span>{isSameAsOriginal ? "No changes" : "Update"}</span>
        </ButtonLoading>
      </form>
    </Form>
  );
}
