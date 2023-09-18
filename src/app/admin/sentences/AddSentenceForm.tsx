"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { AddSentenceSchema } from "~/server/api/routers/inputSchemas";
import { Textarea } from "~/components/ui/textarea";

import { trpc } from "../../_trpc/client";

import type * as z from "zod";

const FormSchema = AddSentenceSchema;

type Props = object;

export function AddSentenceForm(props: Props) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="rawInput"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sentences</FormLabel>
              <FormControl>
                <Textarea placeholder="Contents" {...field} />
              </FormControl>
              <FormDescription>
                Enter sentences on new lines. See preview below.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          preview:
          {newSentences.map((sentence) => (
            <div
              key={sentence}
              className="rounded-md border border-gray-200 p-2"
            >
              {sentence}
            </div>
          ))}
        </div>

        <ButtonLoading isLoading={addSentencesMutation.isLoading} type="submit">
          <span>Create</span>
        </ButtonLoading>
      </form>
    </Form>
  );
}
