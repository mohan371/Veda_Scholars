/**
 * ADMIN MODEL - Database Schema and Interface Definition
 *
 * This file defines the structure of the Admin collection in MongoDB.
 * It uses Mongoose, which is an Object Data Modeling (ODM) library for MongoDB and Node.js.
 *
 * What this file does:
 * 1. Defines the TypeScript interface (IAdmin) - what properties an admin has
 * 2. Creates the MongoDB schema - how data is stored in the database
 * 3. Adds middleware - functions that run automatically before saving
 * 4. Adds instance methods - functions that admin documents can call
 */

import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import { AdminRole, AdminStatus } from "../constants/enums";

/**
 * IAdmin Interface - TypeScript type definition for Admin
 *
 * This interface tells TypeScript what properties an Admin object should have.
 * It extends Document, which gives it MongoDB document properties like _id, save(), etc.
 *
 * When you create an admin, it will have all these properties:
 * - name: Admin's full name
 * - email: Unique email address (used for login)
 * - password: Hashed password (never stored as plain text)
 * - role: Either "Admin" or "SuperAdmin" (from AdminRole enum)
 * - status: Either "Active" or "Inactive" (from AdminStatus enum)
 * - createdAt: Automatically added by MongoDB when document is created
 * - updatedAt: Automatically updated by MongoDB when document is modified
 * - comparePassword(): Method to check if a password matches the stored hash
 */
export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: AdminRole; // Uses enum instead of string for type safety
  status: AdminStatus; // Uses enum instead of string for type safety
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * AdminSchema - MongoDB Schema Definition
 *
 * This defines the structure and validation rules for documents in the Admin collection.
 * Mongoose uses this schema to:
 * - Validate data before saving to MongoDB
 * - Set default values
 * - Enforce data types
 * - Apply transformations (like lowercase, trim)
 */
const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true, // This field must be provided, cannot be empty
      trim: true, // Removes whitespace from beginning and end
    },
    email: {
      type: String,
      required: true,
      unique: true, // No two admins can have the same email
      lowercase: true, // Converts email to lowercase before saving
      trim: true, // Removes whitespace
    },
    password: {
      type: String,
      required: true,
      // Note: We don't set minLength here because validation happens in resolvers
      // Password will be hashed before saving (see pre-save hook below)
    },
    role: {
      type: String,
      enum: Object.values(AdminRole), // Only allows values from AdminRole enum
      default: AdminRole.ADMIN, // Default value if not provided
    },
    status: {
      type: String,
      enum: Object.values(AdminStatus), // Only allows values from AdminStatus enum
      default: AdminStatus.ACTIVE, // Default value if not provided
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

/**
 * PRE-SAVE HOOK - Password Hashing Middleware
 *
 * This function runs automatically before saving an admin document to the database.
 * It ensures passwords are NEVER stored as plain text - they're always hashed.
 *
 * How it works:
 * 1. Checks if the password field was modified (to avoid re-hashing already hashed passwords)
 * 2. Generates a "salt" - random data added to password before hashing (for security)
 * 3. Hashes the password with bcrypt (one-way encryption - cannot be reversed)
 * 4. Replaces the plain text password with the hashed version
 *
 * Why hash passwords?
 * - Security: Even if database is compromised, attackers can't see real passwords
 * - One-way: Hashed password cannot be converted back to original
 * - Salt: Adds randomness, prevents rainbow table attacks
 *
 * Example:
 * Plain text: "password123"
 * Hashed: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890..." (much longer)
 */
AdminSchema.pre("save", async function (next) {
  // Only hash password if it was modified (prevents re-hashing on every save)
  if (!this.isModified("password")) {
    return next(); // Skip hashing and continue saving
  }

  try {
    // Generate a salt (random value) with 10 rounds of hashing
    // Higher rounds = more secure but slower
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    // This creates a one-way encrypted version of the password
    this.password = await bcrypt.hash(this.password, salt);

    // Call next() to continue with the save operation
    next();
  } catch (error: any) {
    // If hashing fails, pass error to Mongoose to prevent saving
    next(error);
  }
});

/**
 * INSTANCE METHOD - Password Comparison
 *
 * This method allows an admin document to check if a provided password matches
 * the stored hashed password. It's used during login.
 *
 * How it works:
 * 1. Takes a plain text password as input (from user login form)
 * 2. Uses bcrypt.compare() to hash it and compare with stored hash
 * 3. Returns true if passwords match, false otherwise
 *
 * Why a method instead of a function?
 * - Encapsulation: Password comparison logic stays with the Admin model
 * - Reusability: Can be called on any admin document
 * - Security: Keeps password handling logic centralized
 *
 * Usage:
 * const admin = await Admin.findOne({ email: "admin@example.com" });
 * const isValid = await admin.comparePassword("userPassword123");
 */
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  // bcrypt.compare() automatically:
  // 1. Extracts the salt from the stored hash
  // 2. Hashes the candidate password with the same salt
  // 3. Compares the two hashes
  // Returns true if they match, false otherwise
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Export the Admin Model
 *
 * This creates and exports the Mongoose model that we use throughout the application
 * to interact with the Admin collection in MongoDB.
 *
 * Usage in resolvers:
 * const admin = new Admin({ name: "John", email: "john@example.com", ... });
 * await admin.save();
 *
 * const admins = await Admin.find();
 * const admin = await Admin.findById(id);
 * await Admin.findByIdAndDelete(id);
 */
export const Admin = model<IAdmin>("Admin", AdminSchema);
