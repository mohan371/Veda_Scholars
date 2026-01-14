/**
 * University-related type definitions
 * These types match the GraphQL schema and backend models
 */

export type UniversityStatus = "Active" | "Inactive" | "Pending";
export type CourseLevel = "Bachelor" | "Master" | "Diploma";

export interface Course {
  name: string;
  level?: CourseLevel;
  tuitionFee?: string;
  intakeMonth?: string;
  notes?: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  location: string;
  logoUrl?: string;
  description?: string;
  status: UniversityStatus;
  courses?: Course[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UniversitiesResponse {
  universities: University[];
}

export interface CreateUniversityVariables {
  name: string;
  country: string;
  location: string;
  description: string;
  logoUrl?: string;
  courses?: Course[];
}

