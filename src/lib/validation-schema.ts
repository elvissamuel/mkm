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

export const getById = z.object({
  id: z.string(),
})

export const approveTestimonySchema = z.object({
  id: z.string(),
  approved: z.boolean(),
})

export type ApproveTestimonySchema = z.infer<typeof approveTestimonySchema>

export const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneCountry: z.string(),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  country: z.string().min(1, "Please select a country"),
  city: z.string().min(1, "Please select a city"),
})

export type PersonalInfoSchema = z.infer<typeof personalInfoSchema>

export enum ConnectionMode {
  LIVE = "Live",
  TEST = "Test"
}
export const programIdSchema = z.object({
  id: z.string().uuid("Invalid program ID format"),
})

export type ProgramIdSchema = z.infer<typeof programIdSchema>


export const createProgramSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  features: z.string().min(1, "Features are required"),
  duration: z.string().min(1, "Duration is required"),
  price: z.number().int().positive("Price must be a positive number"),
})

export type CreateProgramSchema = z.infer<typeof createProgramSchema>

export const updateProgramSchema = z.object({
  id: z.string().uuid("Invalid program ID format"),
  name: z.string().min(1, "Program name is required").optional(),
  features: z.string().min(1, "Features are required").optional(),
  duration: z.string().min(1, "Duration is required").optional(),
  price: z.number().int().positive("Price must be a positive number").optional(),
})

export type UpdateProgramSchema = z.infer<typeof updateProgramSchema>

