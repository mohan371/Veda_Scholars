'use client';

import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Get GraphQL endpoint from environment variable or fallback to localhost for development
const graphqlUri = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8483/graphql';

const httpLink = new HttpLink({
  uri: graphqlUri,
});

// ============================================
// TOKEN RETRIEVAL AND USAGE (Frontend)
// ============================================
// This authLink automatically retrieves the JWT token from localStorage
// and includes it in the Authorization header of every GraphQL request.
//
// Token retrieval location: localStorage.getItem('token')
// Token storage location: See app/admin/page.tsx (admin login)
//
// How it works:
// 1. Every GraphQL query/mutation goes through this authLink
// 2. authLink reads the token from localStorage
// 3. Token is added to request headers as: Authorization: Bearer <token>
// 4. Backend validates token and extracts user info (see backend/src/utils/auth.ts)
// ============================================
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from localStorage if it exists
  // Token was stored here during admin login (see app/admin/page.tsx)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Return the headers to the context so httpLink can read them
  // This adds the Authorization header to every GraphQL request
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache({
    // Optimize cache for better performance
    typePolicies: {
      Query: {
        fields: {
          // Add field policies for better caching if needed
        },
      },
    },
    // Reduce memory usage
    resultCaching: true,
    // Note: InMemoryCache doesn't have built-in size limits
    // Consider implementing cache eviction manually if memory becomes an issue
    // For now, rely on proper cleanup of subscriptions and queries
  }),
  // Disable dev tools in production
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
  },
  // Optimize query deduplication
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
  },
});

