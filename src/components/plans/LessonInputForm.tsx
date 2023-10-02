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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Learning Plan Name</FormLabel>
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
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

        <input
          type="hidden"
          {...form.register("learningPlanId")}
          value={learningPlanId}
        />

        <ButtonLoading isLoading={createLesson.isLoading} type="submit">
          <span>Create</span>
        </ButtonLoading>
      </form>
    </Form>
  );
}
