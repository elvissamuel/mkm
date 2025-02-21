import { z } from "zod";

export const testimonyFormSchema = z.object({
  first_name: z.string(),
  last_name: z.string().optional(),
  email: z.string().optional(),
  // phoneCountry: z.string(),
  phone_number: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  testimony: z.string(),
})

export type TestimonyFormSchema = z.infer<typeof testimonyFormSchema>

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
