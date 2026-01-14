import { Schema, model, Document } from "mongoose";
import { JobStatus } from "../constants/enums";

// Nested Applicant Schema (to store applications within the job document)
const ApplicationSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now }
});

export interface IJob extends Document {
  title: string;
  location: string;
  description: string;
  experienceRequired: string;
  salary?: string;
  status: JobStatus;
  applications: any[];
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    experienceRequired: { type: String, required: true },
    salary: { type: String },
    status: { 
      type: String, 
      enum: Object.values(JobStatus), 
      default: JobStatus.OPEN 
    },
    applications: [ApplicationSchema], // Stores the list of people who applied
  },
  { timestamps: true }
);

export const Job = model<IJob>("Job", JobSchema);