/**
 * ENUMS - Final Corrected Version
 */

// --- ADMIN ---
export enum AdminRole {
  ADMIN = "Admin",
  SUPER_ADMIN = "SuperAdmin",
}

export enum AdminStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

// --- USERS / STUDENTS ---
export enum UserInterest {
  // FIX: Use explicit Keys and Values to ensure GraphQL and Mongoose are happy.
  STUDY_ABROAD = "Study Abroad", 
  JOB = "Job"
}

export enum UserStatus {
  NEW = "New",
  CONTACTED = "Contacted",
  IN_PROCESS = "In Process",
  CLOSED = "Closed"
}

export enum UserRole {
  STUDENT = "Student",
  ADMIN = "Admin" 
}

// --- UNIVERSITIES ---
export enum CourseLevel {
  BACHELOR = "Bachelor",
  MASTER = "Master",
  DIPLOMA = "Diploma"
}

export enum UniversityRole {
  UNIVERSITY = "University"
}

export enum UniversityStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  PENDING = "Pending"
}

// --- JOBS ---
export enum JobStatus {
  OPEN = "Open",
  CLOSED = "Closed"
}

export enum JobType {
  FULL_TIME = "Full-time",
  PART_TIME = "Part-time",
  CONTRACT = "Contract",
  INTERNSHIP = "Internship",
  REMOTE = "Remote"
}