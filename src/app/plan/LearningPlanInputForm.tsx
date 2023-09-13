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
import { LearningPlanCreateSchema } from "~/server/api/routers/inputSchemas";

import { trpc } from "../_trpc/client";

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

        <ButtonLoading isLoading={createLearningPlan.isLoading} type="submit">
          <span>Create</span>
        </ButtonLoading>
      </form>
    </Form>
  );
}
