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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
        <FormField
          control={form.control}
          name="words"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Words</FormLabel>
              <FormControl>
                <Input placeholder="cat, hat, sat" {...field} />
              </FormControl>
              <FormDescription>
                Update the word list for this lesson.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <input type="hidden" {...form.register("lessonId")} />

        <ButtonLoading
          isLoading={createLearningPlan.isLoading}
          type="submit"
          className="bg-green-700 text-white hover:bg-green-800 focus-visible:ring-green-700"
        >
          <span>Save words</span>
        </ButtonLoading>
      </form>
    </Form>
  );
}
