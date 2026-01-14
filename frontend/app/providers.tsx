"use client";

import { ApolloProvider } from "@apollo/client/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { client } from "../lib/apollo-client";
import { NotificationProvider } from "./components/NotificationProvider";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ApolloProvider client={client}>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ApolloProvider>
    </GoogleOAuthProvider>
  );
}
