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
import { LessonCreateSchema } from "~/server/api/routers/inputSchemas";
import { trpc } from "~/lib/trpc/client";

import type * as z from "zod";

const FormSchema = LessonCreateSchema;

type Props = {
  learningPlanId: string;
};

export function LessonInputForm(props: Props) {
  const { learningPlanId } = props;

  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const createLesson = trpc.planRouter.createLesson.useMutation();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await createLesson.mutateAsync(data);

    await utils.planRouter.getAllLearningPlans.invalidate();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson name</FormLabel>
              <FormControl>
                <Input placeholder="Short a" {...field} />
              </FormControl>
              <FormDescription>
                Shown in the lesson list.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Practicing the short a sound" {...field} />
              </FormControl>
              <FormDescription>
                Optional summary shown under the name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <input
          type="hidden"
          {...form.register("learningPlanId")}
          value={learningPlanId}
        />

        <ButtonLoading
          isLoading={createLesson.isLoading}
          type="submit"
          className="bg-green-700 text-white hover:bg-green-800 focus-visible:ring-green-700"
        >
          <span>Create lesson</span>
        </ButtonLoading>
      </form>
    </Form>
  );
}
