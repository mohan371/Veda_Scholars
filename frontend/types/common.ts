/**
 * Common type definitions used across the application
 */

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export interface GraphQLError {
  message: string;
  extensions?: {
    code?: string;
    [key: string]: unknown;
  };
}

export interface ApolloError extends Error {
  message: string;
  graphQLErrors?: GraphQLError[];
  networkError?: Error;
  extraInfo?: unknown;
}

