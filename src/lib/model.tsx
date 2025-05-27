import { Program, Testimony, User } from "@prisma/client";

export interface IValidationError {
  field: string;
  rule: string;
  message: string;
}

export interface IApiError extends Error {
  code: string;
  message: string;
}

export interface IApiResponse<T> {
  data?: T;
  validationErrors?: IValidationError[];
  error?: Error;
}

export interface PaginationData {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// User interfaces
export interface UserWithSubscriptions extends User {
  user_subscriptions: {
    id: string
    user_id: string
    program_id: string
    created_at: string
    program: Program
  }[]
}

export interface UsersResponse {
  users: User[]
  pagination: PaginationData
}

// Testimony interfaces
export interface TestimoniesResponse {
  testimonies: Testimony[]
  pagination: PaginationData
}

// Dashboard stats interface
export interface DashboardStats {
  counts: {
    premiumUsers: number
    freeUsers: number
    programs: number
    testimonies: number
  }
  recent: {
    users: User[]
    testimonies: Testimony[]
  }
}

export interface SuccessProps {
  ref: any;
  email: string
}
