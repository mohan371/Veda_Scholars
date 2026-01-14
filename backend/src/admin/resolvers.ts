/**
 * GRAPHQL RESOLVERS - Implementation of Query and Mutation Logic
 *
 * This file contains the actual implementation of all GraphQL queries and mutations
 * defined in typeDefs.ts. Resolvers are functions that handle the business logic
 * for each GraphQL operation.
 *
 * How Resolvers Work:
 * - Each Query/Mutation in typeDefs.ts has a corresponding resolver function here
 * - GraphQL calls the resolver with: parent, args, context
 * - Resolver performs the operation (database query, validation, etc.)
 * - Resolver returns the data that GraphQL sends to the client
 *
 * Resolver Function Signature:
 * resolver(parent, args, context) {
 *   // parent: Data from parent resolver (usually null for top-level)
 *   // args: Arguments passed from GraphQL query (like { id: "123" })
 *   // context: Request context (contains req object with headers, user info, etc.)
 *   return data; // What GraphQL returns to client
 * }
 */

import { Admin, IAdmin } from "../models/Admin";
import { generateToken } from "../utils/jwt";
import { getAuthContext, requireAdmin } from "../utils/auth";
import { AdminRole, AdminStatus } from "../constants/enums";


import { User } from "../models/User";
import { University } from "../models/University";
import { Job } from "../models/Job";
import { JobStatus } from "../constants/enums"; // Import JobStatus for filtering

/**
 * adminResolvers - Main resolver object containing all resolvers
 *
 * This object is structured to match the GraphQL schema:
 * - Admin: Field resolvers (for transforming Admin type fields)
 * - Query: Read operations (get data)
 * - Mutation: Write operations (create/update/delete data)
 */
export const adminResolvers = {
  /**
   * Admin Type Resolvers - Transform Admin fields for GraphQL response
   *
   * These resolvers convert MongoDB document fields to GraphQL response format.
   * They run automatically when an Admin object is returned in a query/mutation.
   *
   * Why needed?
   * - MongoDB uses _id, GraphQL expects id
   * - MongoDB uses Date objects, GraphQL expects ISO strings
   */
  Admin: {
    /**
     * id Resolver - Converts MongoDB _id to GraphQL id
     *
     * MongoDB stores IDs as _id (ObjectId), but GraphQL schema expects id (String).
     * This resolver converts the MongoDB ObjectId to a string.
     *
     * @param parent - The Admin document from database
     * @returns String representation of the MongoDB _id
     */
    id: (parent: IAdmin) => (parent._id as any).toString(),

    /**
     * createdAt Resolver - Converts Date to ISO string
     *
     * MongoDB stores dates as Date objects, but GraphQL returns strings.
     * ISO format: "2024-01-15T10:30:00.000Z"
     *
     * @param parent - The Admin document from database
     * @returns ISO string representation of createdAt date
     */
    createdAt: (parent: IAdmin) => parent.createdAt.toISOString(),

    /**
     * updatedAt Resolver - Converts Date to ISO string
     *
     * Same as createdAt, but for the updatedAt field.
     *
     * @param parent - The Admin document from database
     * @returns ISO string representation of updatedAt date
     */
    updatedAt: (parent: IAdmin) => parent.updatedAt.toISOString(),
  },

  /**
   * Query Resolvers - Read Operations
   *
   * These resolvers handle fetching data from the database.
   * They correspond to the Query type in the GraphQL schema.
   */
  Query: {
    /**
     * admins Query - Get all admins
     *
     * Fetches all admin users from the database, sorted by creation date
     * (newest first). This is useful for admin management pages.
     *
     * Authentication: Requires admin authentication
     *
     * @param _ - Parent (not used for top-level queries)
     * @param __ - Arguments (none for this query)
     * @param context - Request context containing authentication info
     * @returns Array of Admin documents
     *
     * Example GraphQL query:
     * query {
     *   admins {
     *     id
     *     name
     *     email
     *     role
     *     status
     *   }
     * }
     */
    admins: async (_: any, __: any, context: any) => {
      // Ensure user is authenticated and has admin role
      // This throws an error if not authenticated or not an admin
      requireAdmin(getAuthContext(context.req));

      try {
        // Find all admins and sort by createdAt descending (newest first)
        // Admin.find() returns all documents in the collection
        // .sort({ createdAt: -1 }) sorts by createdAt field in descending order
        const admins = await Admin.find().sort({ createdAt: -1 });
        return admins;
      } catch (error) {
        // If database query fails, throw a user-friendly error
        throw new Error("Failed to fetch admins");
      }
    },

    /**
     * admin Query - Get a single admin by ID
     *
     * Fetches a specific admin user by their unique ID.
     * Useful for viewing/editing a single admin's details.
     *
     * Authentication: Requires admin authentication
     *
     * @param _ - Parent (not used)
     * @param args - Object containing { id: string }
     * @param context - Request context containing authentication info
     * @returns Admin document or throws error if not found
     *
     * Example GraphQL query:
     * query {
     *   admin(id: "507f1f77bcf86cd799439011") {
     *     id
     *     name
     *     email
     *     role
     *   }
     * }
     */
    admin: async (_: any, { id }: { id: string }, context: any) => {
      // Ensure user is authenticated and has admin role
      requireAdmin(getAuthContext(context.req));

      try {
        // Find admin by MongoDB ID
        // Admin.findById(id) searches for document with matching _id
        const admin = await Admin.findById(id);

        // If no admin found, throw error
        if (!admin) {
          throw new Error("Admin not found");
        }

        // Return the found admin
        return admin;
      } catch (error: any) {
        // If error is already our custom error, use its message
        // Otherwise, use generic error message
        throw new Error(error.message || "Failed to fetch admin");
      }
    },
    // --- NEW: Resolver logic for the dashboard stats ---
    dashboardStats: async (_: any, __: any, context: any) => {
      // 1. Ensure user is an admin
      requireAdmin(getAuthContext(context.req));

      try {
        // 2. Run all count queries in parallel for maximum speed
        const [
          userCount,
          universityCount,
          jobCount,
          // activeJobCount, // You can use this if you change totalJobs to activeJobCount
          applicationCountResult
        ] = await Promise.all([
          User.countDocuments(),
          University.countDocuments(),
          Job.countDocuments(),
          // Job.countDocuments({ status: JobStatus.OPEN }), // Example for active jobs
          // This sums the size of all "applications" arrays in the Job collection
          Job.aggregate([
            {
              $project: {
                applicationCount: { $size: "$applications" }
              }
            },
            {
              $group: {
                _id: null,
                totalApplications: { $sum: "$applicationCount" }
              }
            }
          ])
        ]);

        const totalApplications = applicationCountResult[0]?.totalApplications || 0;

        // 3. Return the data in the expected format
        return {
          totalUsers: userCount,
          totalUniversities: universityCount,
          totalJobs: jobCount,
          totalApplications: totalApplications,
        };

      } catch (error: any) {
        throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
      }
    }
  },

  /**
   * Mutation Resolvers - Write Operations
   *
   * These resolvers handle creating, updating, and deleting data.
   * They correspond to the Mutation type in the GraphQL schema.
   */
  Mutation: {
    /**
     * adminLogin Mutation - Authenticate admin and get JWT token
     *
     * This is the login mutation. It verifies the email/password,
     * checks if the account is active, and returns a JWT token.
     *
     * Authentication: None required (this is the login endpoint)
     *
     * @param _ - Parent (not used)
     * @param args - Object containing { email: string, password: string }
     * @param context - Request context (not used for login)
     * @returns AuthResponse with token and admin info
     *
     * How it works:
     * 1. Validate that email and password are provided
     * 2. Find admin by email (case-insensitive)
     * 3. Check if admin exists (throw error if not)
     * 4. Check if account is active (throw error if inactive)
     * 5. Compare provided password with stored hash
     * 6. Generate JWT token with admin info
     * 7. Return token and admin data
     *
     * Example GraphQL mutation:
     * mutation {
     *   adminLogin(email: "admin@example.com", password: "password123") {
     *     token
     *     admin {
     *       id
     *       name
     *       email
     *     }
     *   }
     * }
     */
    adminLogin: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      try {
        // Validate required fields
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        // Find admin by email (convert to lowercase for case-insensitive search)
        // Admin.findOne() returns the first document matching the query, or null
        const admin = await Admin.findOne({ email: email.toLowerCase() });

        // Check if admin exists
        // We use generic error message to prevent email enumeration attacks
        // (don't reveal whether email exists or not)
        if (!admin) {
          throw new Error("Invalid email or password");
        }

        // Check if account is active
        // Inactive accounts cannot log in even with correct password
        if (admin.status !== AdminStatus.ACTIVE) {
          throw new Error("Account is inactive");
        }

        // Verify password
        // comparePassword() hashes the provided password and compares with stored hash
        // Returns true if passwords match, false otherwise
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Generate JWT token
        // This token will be sent to client and used for authentication in future requests
        const token = generateToken({
          id: (admin._id as any).toString(), // Convert MongoDB ObjectId to string
          email: admin.email,
          role: admin.role,
        });

        // Return token and admin information
        // Client stores token and uses it in Authorization header for future requests
        return {
          token,
          admin,
        };
      } catch (error: any) {
        // Return error message to client
        throw new Error(error.message || "Login failed");
      }
    },

    /**
     * createAdmin Mutation - Create a new admin account
     *
     * Creates a new admin user in the database. The password is automatically
     * hashed before saving (see Admin model pre-save hook).
     *
     * Authentication: Currently disabled (for creating first admin)
     *                 Should be enabled after first admin is created
     *
     * @param _ - Parent (not used)
     * @param args - Object containing admin fields (name, email, password, etc.)
     * @param context - Request context for authentication check
     * @returns Created Admin document
     *
     * How it works:
     * 1. Validate required fields (name, email, password)
     * 2. Check if email already exists (emails must be unique)
     * 3. Create new Admin document with provided data
     * 4. Save to database (password is automatically hashed)
     * 5. Return created admin
     *
     * Example GraphQL mutation:
     * mutation {
     *   createAdmin(
     *     name: "John Doe"
     *     email: "john@example.com"
     *     password: "securepassword123"
     *     role: Admin
     *     status: Active
     *   ) {
     *     id
     *     name
     *     email
     *   }
     * }
     */
    createAdmin: async (
      _: any,
      {
        name,
        email,
        password,
        role,
        status,
      }: {
        name: string;
        email: string;
        password: string;
        role?: string;
        status?: string;
      },
      context: any
    ) => {
      // TODO: Re-enable authentication after creating first admin
      // This ensures only existing admins can create new admins
      // requireAdmin(getAuthContext(context.req));

      try {
        // Validate required fields
        if (!name || !email || !password) {
          throw new Error("Name, email, and password are required");
        }

        // Check if admin with this email already exists
        // Emails must be unique - no two admins can have the same email
        const existingAdmin = await Admin.findOne({
          email: email.toLowerCase(),
        });
        if (existingAdmin) {
          throw new Error("Admin with this email already exists");
        }

        // Create new Admin document
        // The password will be automatically hashed by the pre-save hook
        const admin = new Admin({
          name: name.trim(), // Remove whitespace
          email: email.toLowerCase().trim(), // Normalize email
          password, // Will be hashed automatically
          role: (role as AdminRole) || AdminRole.ADMIN, // Default to Admin if not provided
          status: (status as AdminStatus) || AdminStatus.ACTIVE, // Default to Active if not provided
        });

        // Save to database
        // This triggers the pre-save hook which hashes the password
        const savedAdmin = await admin.save();

        // Return the created admin (password is hashed, not plain text)
        return savedAdmin;
      } catch (error: any) {
        // Return error to client
        throw new Error(error.message || "Failed to create admin");
      }
    },

    /**
     * updateAdmin Mutation - Update an existing admin account
     *
     * Updates one or more fields of an admin account. Only the fields provided
     * in the arguments will be updated - other fields remain unchanged.
     *
     * Authentication: Requires admin authentication
     *
     * @param _ - Parent (not used)
     * @param args - Object containing id and optional fields to update
     * @param context - Request context for authentication check
     * @returns Updated Admin document
     *
     * How it works:
     * 1. Authenticate user (must be admin)
     * 2. Find admin by ID
     * 3. For each provided field, update it (if undefined, skip)
     * 4. If email is changed, check for uniqueness
     * 5. Save changes to database
     * 6. Return updated admin
     *
     * Example GraphQL mutation:
     * mutation {
     *   updateAdmin(
     *     id: "507f1f77bcf86cd799439011"
     *     name: "Jane Doe"
     *     status: Inactive
     *   ) {
     *     id
     *     name
     *     status
     *   }
     * }
     */
    updateAdmin: async (
      _: any,
      {
        id,
        name,
        email,
        password,
        role,
        status,
      }: {
        id: string;
        name?: string;
        email?: string;
        password?: string;
        role?: string;
        status?: string;
      },
      context: any
    ) => {
      // Ensure user is authenticated and has admin role
      requireAdmin(getAuthContext(context.req));

      try {
        // Find admin by ID
        const admin = await Admin.findById(id);

        // Check if admin exists
        if (!admin) {
          throw new Error("Admin not found");
        }

        // Update fields only if they are provided (not undefined)
        // This allows partial updates - only change what's specified

        if (name !== undefined) {
          // Update name if provided
          admin.name = name.trim();
        }

        if (email !== undefined) {
          // Update email if provided
          const emailLower = email.toLowerCase().trim();

          // Only check uniqueness if email is actually changing
          if (emailLower !== admin.email) {
            // Check if new email already exists
            const existingAdmin = await Admin.findOne({ email: emailLower });
            if (existingAdmin) {
              throw new Error("Admin with this email already exists");
            }
            // Email is unique and different, update it
            admin.email = emailLower;
          }
        }

        if (password !== undefined) {
          // Update password if provided
          // Password will be automatically re-hashed by pre-save hook
          admin.password = password;
        }

        if (role !== undefined) {
          // Update role if provided
          // Cast to AdminRole enum for type safety
          admin.role = role as AdminRole;
        }

        if (status !== undefined) {
          // Update status if provided
          // Cast to AdminStatus enum for type safety
          admin.status = status as AdminStatus;
        }

        // Save changes to database
        // This triggers validation and pre-save hooks (like password hashing)
        const updatedAdmin = await admin.save();

        // Return updated admin
        return updatedAdmin;
      } catch (error: any) {
        // Return error to client
        throw new Error(error.message || "Failed to update admin");
      }
    },

    /**
     * deleteAdmin Mutation - Delete an admin account
     *
     * Permanently removes an admin from the database. This action cannot be undone.
     *
     * Authentication: Requires admin authentication
     *
     * @param _ - Parent (not used)
     * @param args - Object containing { id: string }
     * @param context - Request context for authentication check
     * @returns Boolean (true if deleted, false if not found)
     *
     * How it works:
     * 1. Authenticate user (must be admin)
     * 2. Find and delete admin by ID
     * 3. Check if admin was found and deleted
     * 4. Return true if successful
     *
     * Example GraphQL mutation:
     * mutation {
     *   deleteAdmin(id: "507f1f77bcf86cd799439011")
     * }
     */
    deleteAdmin: async (_: any, { id }: { id: string }, context: any) => {
      // Ensure user is authenticated and has admin role
      requireAdmin(getAuthContext(context.req));

      try {
        // Find and delete admin by ID
        // findByIdAndDelete() removes the document and returns it, or null if not found
        const result = await Admin.findByIdAndDelete(id);

        // Check if admin was found and deleted
        if (!result) {
          throw new Error("Admin not found");
        }

        // Return true to indicate successful deletion
        return true;
      } catch (error: any) {
        // Return error to client
        throw new Error(error.message || "Failed to delete admin");
      }
    },
  },
};
