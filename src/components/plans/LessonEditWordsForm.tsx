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
import { Input } from "~/components/ui/input";
import { LessonEditWordsSchema } from "~/server/api/routers/inputSchemas";
import { trpc } from "~/lib/trpc/client";

import type * as z from "zod";

const FormSchema = LessonEditWordsSchema;

type Props = {
  lessonId: string;
  defaultWords: string;
};

export function LessonEditWordsForm(props: Props) {
  const { lessonId } = props;

  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lessonId,
      words: props.defaultWords,
    },
  });

  const createLearningPlan = trpc.planRouter.editLessonWords.useMutation();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await createLearningPlan.mutateAsync(data);

    await utils.planRouter.getAllLearningPlans.invalidate();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="words"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Words</FormLabel>
              <FormControl>
                <Input placeholder="Short Vowel sounds" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <input type="hidden" {...form.register("lessonId")} />

        <ButtonLoading isLoading={createLearningPlan.isLoading} type="submit">
          <span>Create</span>
        </ButtonLoading>
      </form>
    </Form>
  );
}
