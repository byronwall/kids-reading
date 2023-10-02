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
import { LessonBulkImportWordsSchema } from "~/server/api/routers/inputSchemas";
import { Textarea } from "~/components/ui/textarea";
import { trpc } from "~/lib/trpc/client";

import type * as z from "zod";

const FormSchema = LessonBulkImportWordsSchema;

type Props = {
  learningPlanId: string;
};

export function LessonBulkImportWordsForm(props: Props) {
  const { learningPlanId } = props;

  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      learningPlanId,
    },
  });

  const bulkImportMutation = trpc.planRouter.bulkImportLesson.useMutation();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await bulkImportMutation.mutateAsync(data);

    await utils.planRouter.getAllLearningPlans.invalidate();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="contents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Words</FormLabel>
              <FormControl>
                <Textarea placeholder="Contents" {...field} />
              </FormControl>
              <FormDescription>
                Expected format is <code>| topic | sub topic | words |</code>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <input type="hidden" {...form.register("learningPlanId")} />

        <ButtonLoading isLoading={bulkImportMutation.isLoading} type="submit">
          <span>Create</span>
        </ButtonLoading>
      </form>
    </Form>
  );
}
