/**
* GRAPHQL TYPE DEFINITIONS (Schema)
*
* This file defines the GraphQL schema - the contract between client and server.
* It specifies what queries and mutations are available, what data they accept,
* and what data they return.
*
* (All these comments are fine because they are OUTSIDE the gql tag)
*/

import gql from "graphql-tag";

/**
* GraphQL Schema Definition
*
* This schema defines all the types, enums, queries, and mutations for the Admin API.
* The schema acts as documentation and validation for all API operations.
*/
export const adminTypeDefs = gql`
  # AdminRole Enum - Possible roles for admin users
  #
  # This matches the AdminRole enum in TypeScript (constants/enums.ts).
  # GraphQL enums ensure only valid values can be used in queries/mutations.
  #
  # Values:
  # - Admin: Regular administrator
  # - SuperAdmin: Administrator with elevated privileges
  enum AdminRole {
    Admin
    SuperAdmin
  }

  # AdminStatus Enum - Possible statuses for admin accounts
  #
  # This matches the AdminStatus enum in TypeScript (constants/enums.ts).
  # Used to activate/deactivate admin accounts.
  #
  # Values:
  # - Active: Account is enabled and can log in
  # - Inactive: Account is disabled and cannot log in
  enum AdminStatus {
    Active
    Inactive
  }

  # Admin Type - Represents an admin user in the system
  #
  # This type defines the structure of an Admin object.
  # All fields marked with ! are required and cannot be null.
  #
  # Fields:
  # - id: Unique identifier (converted from MongoDB _id)
  # - name: Full name of the admin
  # - email: Unique email address (used for login)
  # - role: Admin's role (AdminRole enum)
  # - status: Account status (AdminStatus enum)
  # - createdAt: When the admin account was created (ISO string)
  # - updatedAt: When the admin account was last updated (ISO string)
  type Admin {
    id: ID!
    name: String!
    email: String!
    role: AdminRole! # Uses enum for type safety
    status: AdminStatus! # Uses enum for type safety
    createdAt: String!
    updatedAt: String!
  }

  # AuthResponse Type - Returned after successful login
  #
  # This type contains both the JWT token (for future requests) and
  # the admin information (for immediate use in the UI).
  #
  # Fields:
  # - token: JWT token string (store this and send with future requests)
  # - admin: Full admin object with all user information
  type AuthResponse {
    token: String!
    admin: Admin!
  }

  # Query Type - Read Operations
  #
  # Queries are used to fetch data from the server (like GET requests in REST).
  # They should not modify data - use Mutations for that.
  #
  # Available Queries:
  # - admins: Get all admins (requires authentication)
  # - admin(id): Get a specific admin by ID (requires authentication)

   # --- NEW: Define the data structure for our dashboard cards ---
  type DashboardStats {
    totalUsers: Int!
    totalUniversities: Int!
    totalJobs: Int!
    totalApplications: Int!
  }
  type Query {
    # Get all admins, sorted by creation date (newest first)
    # Returns array of Admin objects (empty array if no admins)
    # Requires: Admin authentication
    admins: [Admin!]!

    # Get a single admin by their unique ID
    # Returns Admin object or null if not found
    # Requires: Admin authentication
    admin(id: ID!): Admin
    # --- NEW: Add the query to fetch dashboard stats ---
    # This is protected by the admin resolver
    dashboardStats: DashboardStats!
  }


  
  # Mutation Type - Write Operations
  #
  # Mutations are used to create, update, or delete data (like POST/PUT/DELETE in REST).
  # They modify the database and should be protected with authentication.
  #
  # Available Mutations:
  # - adminLogin: Authenticate and get JWT token
  # - createAdmin: Create a new admin account
  # - updateAdmin: Update an existing admin account
  # - deleteAdmin: Delete an admin account
  type Mutation {
    # adminLogin - Authenticate an admin and get JWT token
    #
    # This mutation is used for logging in. It verifies email/password,
    # checks account status, and returns a JWT token for future requests.
    #
    # Parameters:
    # - email: Admin's email address (required)
    # - password: Admin's password (required)
    #
    # Returns: AuthResponse with token and admin information
    #
    # Errors:
    # - "Invalid email or password" - Wrong credentials
    # - "Account is inactive" - Admin account is disabled
    #
    # Note: This is the only mutation that doesn't require authentication
    adminLogin(email: String!, password: String!): AuthResponse!

    # createAdmin - Create a new admin account
    #
    # Creates a new admin user in the database. Password is automatically
    # hashed before saving (see Admin model pre-save hook).
    #
    # Parameters:
    # - name: Full name (required)
    # - email: Email address, must be unique (required)
    # - password: Plain text password, will be hashed (required)
    # - role: Admin role (optional, defaults to "Admin")
    # - status: Account status (optional, defaults to "Active")
    #
    # Returns: Created Admin object
    #
    # Requires: Admin authentication (currently disabled for first admin creation)
    #
    # Errors:
    # - "Admin with this email already exists" - Email must be unique
    createAdmin(
      name: String!
      email: String!
      password: String!
      role: AdminRole # Optional, uses enum
      status: AdminStatus # Optional, uses enum
    ): Admin!

    # updateAdmin - Update an existing admin account
    #
    # Updates one or more fields of an admin account. Only provided fields
    # will be updated - other fields remain unchanged.
    #
    # Parameters:
    # - id: Admin's unique ID (required)
    # - name: New name (optional)
    # - email: New email (optional, must be unique)
    # - password: New password, will be hashed (optional)
    # - role: New role (optional)
    # - status: New status (optional)
    #
    # Returns: Updated Admin object
    #
    # Requires: Admin authentication
    #
    # Errors:
    # - "Admin not found" - ID doesn't exist
    # - "Admin with this email already exists" - Email already in use
    updateAdmin(
      id: ID!
      name: String
      email: String
      password: String
      role: AdminRole # Optional, uses enum
      status: AdminStatus # Optional, uses enum
    ): Admin!

    # deleteAdmin - Delete an admin account
    #
    # Permanently removes an admin from the database. This action cannot be undone.
    #
    # Parameters:
    # - id: Admin's unique ID (required)
    #
    # Returns: Boolean (true if successful, false if not found)
    #
    # Requires: Admin authentication
    #
    # Errors:
    # - "Admin not found" - ID doesn't exist
    deleteAdmin(id: ID!): Boolean!
  }
`;