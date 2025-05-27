import { z } from "zod";
import { DashboardStats, IApiError, IApiResponse, IValidationError, TestimoniesResponse, UsersResponse, UserWithSubscriptions } from "./model";
import { ApproveTestimonySchema, CreateProgramSchema, getById, PersonalInfoSchema, ProgramIdSchema, SendEmailSchema, testimonyFormSchema, UpdateProgramSchema } from "./validation-schema";
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

export const getProgramById = async (input: z.infer<typeof getById>): Promise<IApiResponse<Program>> => {
  return handleApiCalls(await fetch(process.env.NEXT_PUBLIC_BROWSER_URL + "api/program/" + input.id, {
    method: "GET",
    // body: JSON.stringify(input),
  }));
};

export const registerUser = async (input: PersonalInfoSchema): Promise<IApiResponse<User>> => {
  return handleApiCalls(await fetch(process.env.NEXT_PUBLIC_BROWSER_URL + "api/register", {
    method: "POST",
    body: JSON.stringify(input),
  }));
};

export const resendEmail = async (input: SendEmailSchema): Promise<IApiResponse<User>> => {
  return handleApiCalls(await fetch(process.env.NEXT_PUBLIC_BROWSER_URL + "api/send-email", {
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

export const getUsers = async (
  page = 1,
  limit = 10,
  role?: "USER" | "PREMIUM" | "ALL",
  search?: string,
  sortBy?: string,
  sortOrder?: "asc" | "desc",
): Promise<IApiResponse<UsersResponse>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (role) params.append("role", role)
  if (search) params.append("search", search)
  if (sortBy) params.append("sortBy", sortBy)
  if (sortOrder) params.append("sortOrder", sortOrder)

  return handleApiCalls(
    await fetch(`${process.env.NEXT_PUBLIC_BROWSER_URL}api/users?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }),
  )
}

export const getUserById = async (id: string): Promise<IApiResponse<UserWithSubscriptions>> => {
  return handleApiCalls(
    await fetch(`${process.env.NEXT_PUBLIC_BROWSER_URL}api/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }),
  )
}

// Testimony API calls
export const getTestimonies = async (
  page = 1,
  limit = 10,
  search?: string,
  sortBy?: string,
  sortOrder?: "asc" | "desc",
): Promise<IApiResponse<TestimoniesResponse>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (search) params.append("search", search)
  if (sortBy) params.append("sortBy", sortBy)
  if (sortOrder) params.append("sortOrder", sortOrder)

  return handleApiCalls(
    await fetch(`${process.env.NEXT_PUBLIC_BROWSER_URL}api/testimony?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }),
  )
}

export const getTestimonyById = async (id: string): Promise<IApiResponse<Testimony>> => {
  return handleApiCalls(
    await fetch(`${process.env.NEXT_PUBLIC_BROWSER_URL}api/testimony/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }),
  )
}

// Dashboard stats API call
export const getDashboardStats = async (): Promise<IApiResponse<DashboardStats>> => {
  return handleApiCalls(
    await fetch(`${process.env.NEXT_PUBLIC_BROWSER_URL}api/dashboard-stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }),
  )
}

export const createProgram = async (input: CreateProgramSchema): Promise<IApiResponse<Program>> => {
  return handleApiCalls(await fetch(process.env.NEXT_PUBLIC_BROWSER_URL + "api/program", {
    method: "POST",
    body: JSON.stringify(input),
  }));
};

export const deleteProgram = async (input: ProgramIdSchema): Promise<IApiResponse<Program>> => {
  return handleApiCalls(await fetch(process.env.NEXT_PUBLIC_BROWSER_URL + "api/program", {
    method: "DELETE",
    body: JSON.stringify(input),
  }));
};

export const editProgram = async (input: UpdateProgramSchema): Promise<IApiResponse<Program>> => {
  return handleApiCalls(await fetch(process.env.NEXT_PUBLIC_BROWSER_URL + "api/program", {
    method: "PUT",
    body: JSON.stringify(input),
  }));
};

export const approveTestimony = async (data: ApproveTestimonySchema): Promise<IApiResponse<Testimony>> => {
  return handleApiCalls(
    await fetch(`${process.env.NEXT_PUBLIC_BROWSER_URL}api/testimony`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),
  )
}