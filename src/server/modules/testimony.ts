import { testimonyFormSchema } from "@/lib/validation-schema";
import { publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

export const createTestimony = publicProcedure
  .input(testimonyFormSchema)
  .mutation(async (opts) => {
    try {
      const testimony = await prisma.testimony.create({
        data: {
          ...opts.input,
        },
      });

      return testimony;
    } catch (error) {
      // Handle the error appropriately
      console.error("Failed to create testimony:", error);

      // You can throw a custom error or return a specific error response
      throw new Error("Failed to create testimony due to an internal error.");
    }
  });