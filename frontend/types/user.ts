/**
 * User-related type definitions
 * These types match the GraphQL schema and backend models
 */

export type UserRole = "Student" | "Admin";
export type UserStatus = "New" | "Contacted" | "In Process" | "Closed";
export type UserInterest = "StudyAbroad" | "Job";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  interest?: UserInterest;
  preferredCountry?: string;
  qualification?: string;
  resumeUrl?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  users: User[];
}

export interface CreateUserVariables {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
}

// Mutation Response Types
export interface RegisterUserResponse {
  registerUser: {
    user: User;
  };
}

export interface UpdateUserResponse {
  adminUpdateUser: User;
}

export interface DeleteUserResponse {
  deleteUser: boolean;
}

