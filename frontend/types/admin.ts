/**
 * Admin-related type definitions
 * These types match the GraphQL schema and backend models
 */

export type AdminRole = "Admin" | "SuperAdmin";
export type AdminStatus = "Active" | "Inactive";

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  admin: Admin;
}

export interface AdminLoginResponse {
  adminLogin: AuthResponse;
}

export interface AdminLoginVariables {
  email: string;
  password: string;
}

