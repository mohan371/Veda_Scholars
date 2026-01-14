import gql from "graphql-tag";

export const jobTypeDefs = gql`
  # JOB STATUS ENUM
  enum JobStatus {
    Open
    Closed
  }

  # APPLICATION TYPE (What the admin sees for an applicant)
  type Application {
    name: String!
    email: String!
    phone: String!
    resumeUrl: String!
    appliedAt: String! # Date the application was submitted
  }

  # JOB TYPE
  type Job {
    id: ID!
    title: String!
    location: String!
    description: String!
    experienceRequired: String!
    salary: String
    status: JobStatus!
    applications: [Application!]! # List of applicants
    createdAt: String!
    updatedAt: String!
  }

  # QUERY OPERATIONS (Reading)
  extend type Query {
    jobs: [Job!]!
    job(id: ID!): Job
  }

  # MUTATION OPERATIONS (Writing)
  extend type Mutation {
    # Admin: Create New Job Post
    createJob(
      title: String!
      location: String!
      description: String!
      experienceRequired: String!
      salary: String
      status: JobStatus
    ): Job!

    # Admin: Update Job Details/Status
    updateJob(
      id: ID!
      title: String
      location: String
      description: String
      experienceRequired: String
      salary: String
      status: JobStatus
    ): Job!

    # Admin: Delete Job
    deleteJob(id: ID!): Boolean!

    # Public: Apply for Job (Used by students/external users)
    applyForJob(
      jobId: ID!
      name: String!
      email: String!
      phone: String!
      resumeUrl: String!
    ): Boolean!
  }
`;