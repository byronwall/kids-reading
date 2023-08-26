import bcrypt from "bcrypt";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const authRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  createUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )

    .mutation(async ({ input }) => {
      const { email, password } = input;
      const hashedPassword = await bcrypt.hash(password, 10); // hash password with bcrypt

      console.log("create user mutation called", { email, password });

      // check if user already exists
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user) {
        // TODO: probably return an error instead of throwing
        throw new Error(`User ${email} already exists!`);
      }

      // create user with hashed password
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return {
        message: `User ${email} created successfully!`,
      };
    }),
});
