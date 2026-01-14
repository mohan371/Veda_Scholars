import { Schema, model, Document } from "mongoose";
import { CourseLevel, UniversityStatus } from "../constants/enums";

// Nested Schema for Courses inside a University
const CourseSchema = new Schema({
  name: { type: String, required: true },
  level: { type: String, enum: Object.values(CourseLevel), required: true },
  tuitionFee: { type: String }, // Optional field for fee
  intakeMonth: { type: String, required: true },
  notes: { type: String }
});

export interface IUniversity extends Document {
  name: string;
  country: string;
  location: string; // <--- FIX: ADDED LOCATION HERE
  logoUrl?: string;
  description?: string;
  status: UniversityStatus;
  courses: any[]; // Array of course objects
  createdAt: Date;
  updatedAt: Date;
}

const UniversitySchema = new Schema<IUniversity>(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true }, // <--- FIX: ADDED LOCATION HERE
    logoUrl: { type: String },
    description: { type: String }, // Short description (2-3 lines)
    status: { 
      type: String, 
      enum: Object.values(UniversityStatus), 
      default: UniversityStatus.ACTIVE 
    },
    courses: [CourseSchema], // Embedded array of courses
  },
  { timestamps: true }
);

export const University = model<IUniversity>("University", UniversitySchema);