/**
 * Job-related type definitions
 * These types match the GraphQL schema and backend models
 */

export type JobStatus = "Open" | "Closed" | "Draft";

export interface JobApplication {
  name: string;
  email?: string;
  phone?: string;
  resumeUrl?: string;
  appliedAt?: string;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  description?: string;
  experienceRequired: string;
  salary?: string;
  status: JobStatus;
  applications?: JobApplication[];
  createdAt?: string;
  updatedAt?: string;
}

export interface JobsResponse {
  jobs: Job[];
}

export interface CreateJobVariables {
  title: string;
  location: string;
  description: string;
  experienceRequired: string;
  salary?: string;
  status?: JobStatus;
}

