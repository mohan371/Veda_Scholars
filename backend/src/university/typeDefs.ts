import gql from "graphql-tag";

export const universityTypeDefs = gql`
  enum CourseLevel {
    Bachelor
    Master
    Diploma
  }

  type Course {
    name: String!
    level: CourseLevel!
    tuitionFee: String
    intakeMonth: String!
    notes: String
  }

  input CourseInput {
    name: String!
    level: CourseLevel!
    tuitionFee: String
    intakeMonth: String!
    notes: String
  }

  type University {
    id: ID!
    name: String!
    country: String!
    logoUrl: String
    description: String
    courses: [Course!]!
    createdAt: String!
    updatedAt: String!
    status: String
    location: String
  }

  extend type Query {
    universities: [University!]!
    university(id: ID!): University
  }

  extend type Mutation {
    createUniversity(
      name: String!
      country: String!
      location: String
      logoUrl: String
      description: String
      courses: [CourseInput!]
    ): University!

    updateUniversity(
      id: ID!
      name: String
      country: String
      logoUrl: String
      description: String
      courses: [CourseInput!]
    ): University!

    deleteUniversity(id: ID!): Boolean!
  }
`;