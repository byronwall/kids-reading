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
import { LearningPlanCreateSchema } from "~/server/api/routers/inputSchemas";
import { trpc } from "~/lib/trpc/client";

import type * as z from "zod";

export function LearningPlanInputForm() {
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof LearningPlanCreateSchema>>({
    resolver: zodResolver(LearningPlanCreateSchema),
  });

  const createLearningPlan = trpc.planRouter.createLearningPlan.useMutation();

  async function onSubmit(data: z.infer<typeof LearningPlanCreateSchema>) {
    await createLearningPlan.mutateAsync(data);

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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Short vowel sounds" {...field} />
              </FormControl>
              <FormDescription>
                Shown as the plan title everywhere.
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
                <Input placeholder="CVC words for new readers" {...field} />
              </FormControl>
              <FormDescription>
                Optional summary shown under the title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <ButtonLoading
          isLoading={createLearningPlan.isLoading}
          type="submit"
          className="bg-green-700 text-white hover:bg-green-800 focus-visible:ring-green-700"
        >
          <span>Create plan</span>
        </ButtonLoading>
      </form>
    </Form>
  );
}
