import gql from "graphql-tag";

export const userTypeDefs = gql`
  #
  # USERS / STUDENTS MODULE
  # Defines the API based on the "Essential Website Requirements"
  #

  # Enums (Must match enums.ts)
  enum UserRole {
    Student
    Admin
  }

  enum UserStatus {
    New
    Contacted
    InProcess
    Closed
  }

  enum UserInterest {
    StudyAbroad
    Job
  }

  # Data structure for a User/Student
  type User {
    id: ID!
    name: String
    email: String!
    phone: String!
    interest: UserInterest
    preferredCountry: String
    qualification: String
    resumeUrl: String
    notes: String
    role: UserRole!
    status: UserStatus!
    createdAt: String!
    updatedAt: String!
  }

  # Response for a successful login
  type UserAuthResponse {
    token: String!
    user: User!
  }

  # --- Queries (Reading Data) ---
  extend type Query {
    # Get the currently logged-in user's profile
    me: User

    # Get all users (for the Admin Panel)
    users: [User!]!
    
    # Get a single user by ID
    user(id: ID!): User
  }

  # --- Mutations (Writing Data) ---
  extend type Mutation {
    # Public: For the "Quick Inquiry Form" or Registration
    registerUser(
      name: String!
      email: String!
      password: String!
      phone: String!
      userType: String!
      interest: String
      preferredCountry: String
      qualification: String
    ): UserAuthResponse!

    # Public: For student login
    loginUser(email: String!, password: String!): UserAuthResponse!

    # Public: Google Login/Signup
    googleLogin(token: String!, userType: String): UserAuthResponse!

    # User: Update own profile
    updateProfile(
      name: String
      phone: String
      interest: UserInterest
      preferredCountry: String
      qualification: String
      resumeUrl: String
      notes: String
    ): User!

    # Admin: To edit user details, status, and notes
    adminUpdateUser(
      id: ID!
      status: UserStatus
      notes: String
      name: String
      email: String
      phone: String
      interest: UserInterest
      preferredCountry: String
      qualification: String
      role: UserRole
    ): User!

    # Admin: Delete a user
    deleteUser(id: ID!): Boolean!
  }
`;