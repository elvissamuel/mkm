import { z } from "zod";
import { IApiError, IApiResponse, IValidationError } from "./model";
import { getById, PersonalInfoSchema, testimonyFormSchema } from "./validation-schema";
import { Program, Testimony, User } from "@prisma/client";


async function handleValidationResponse (response: Response) {
  const issues = await response.json() as IValidationError[];
  const data = await response.json() as { error: { code: string; message: string; path: string[] }[] };
  const validationErrors = data.error;

  validationErrors.forEach(error => {
    issues.push({
      rule: error.code,
      message: error.message,
      field: error.path[0],
    });
  });

  return issues;
}

async function handleServerError (response: Response) {
  const data = await response.json() as IApiError;

  return data;
}

async function handleApiCalls<T> (response: Response): Promise<IApiResponse<T>> {
  try {
    if (response.status >= 400 && response.status <= 499) {
      return { validationErrors: await handleValidationResponse(response) };
    }

    if (response.status >= 500) {
      return { error: await handleServerError(response) };
    }

    return { data: await response.json() as T };
  } catch (error) {
    console.error("api call error", error);

    return { ...(error ? { error } : {}) } as IApiResponse<T>;
  }
}

// export const getClientAddresses = async (id: string): Promise<IApiResponse<IAddress[]>> => {
//   return handleApiCalls(await fetch(process.env.NEXT_PUBLIC_BROWSER_URL + "/api/addresses/clients/" + id, { method: "GET" }));
// };

export const addTestimony = async (input: z.infer<typeof testimonyFormSchema>): Promise<IApiResponse<Testimony>> => {
  return handleApiCalls(await fetch(process.env.NEXT_PUBLIC_BROWSER_URL + "api/testimony", {
    method: "POST",
    body: JSON.stringify(input),
  }));
};

export const getPrograms = async (): Promise<IApiResponse<Program[]>> => {
  return handleApiCalls(await fetch(process.env.NEXT_PUBLIC_BROWSER_URL + "api/program", { method: "GET" }));
};

export const getSingleProgram = async (input: z.infer<typeof getById>): Promise<IApiResponse<Program>> => {
  return handleApiCalls(await fetch(process.env.NEXT_PUBLIC_BROWSER_URL + "api/program", {
    method: "POST",
    body: JSON.stringify(input),
  }));
};

export const registerUser = async (input: PersonalInfoSchema): Promise<IApiResponse<User>> => {
  return handleApiCalls(await fetch(process.env.NEXT_PUBLIC_BROWSER_URL + "api/register", {
    method: "POST",
    body: JSON.stringify(input),
  }));
};

export const sendEmail = async (): Promise<IApiResponse<User>> => {
  return handleApiCalls(await fetch(process.env.NEXT_PUBLIC_BROWSER_URL + "api/send", {
    method: "POST",
    // body: JSON.stringify(input),
  }));
};