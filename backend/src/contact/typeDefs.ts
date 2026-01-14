/**
 * GraphQL Type Definitions for Contact Form
 * 
 * This file defines the GraphQL schema for contact form submissions.
 * The contact form allows users to send inquiries directly to the admin email.
 */

import { gql } from "graphql-tag";

export const contactTypeDefs = gql`
  # Contact Form Input Type
  # Contains all the fields required for a contact form submission
  input ContactFormInput {
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    subject: String!
    message: String!
  }

  # Contact Form Response Type
  # Returns success status and a message after form submission
  type ContactFormResponse {
    success: Boolean!
    message: String!
  }

  # Mutation for submitting contact forms
  # This mutation sends an email to the admin with the form data
  type Mutation {
    submitContactForm(input: ContactFormInput!): ContactFormResponse!
  }
`;

