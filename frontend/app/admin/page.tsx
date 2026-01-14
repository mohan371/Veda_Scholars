"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { gql } from "@apollo/client";

import Button from "../components/Button"; // Adjust path if needed
import { client } from "../../lib/apollo-client"; // Import client directly
import { useNotification } from "../components/NotificationProvider";
import {
  AdminLoginResponse,
  AdminLoginVariables,
  ApolloError,
} from "../../types";

// 1. Define the Login Mutation
const ADMIN_LOGIN = gql`
  mutation AdminLogin($email: String!, $password: String!) {
    adminLogin(email: $email, password: $password) {
      token
      admin {
        id
        name
        email
        role
      }
    }
  }
`;

export default function AdminLogin() {
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("test123");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  // Note: We use client.mutate directly instead of the useMutation hook here for cleaner state management,
  // but both methods work if ApolloProvider is set up correctly.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isLoading) return;

    setIsLoading(true);

    try {
      // 2. Call the Backend API
      const { data } = await client.mutate<
        AdminLoginResponse,
        AdminLoginVariables
      >({
        mutation: ADMIN_LOGIN,
        variables: { email, password },
      });

      // 3. Success! Save Token and Redirect
      // ============================================
      // TOKEN STORAGE LOCATION (Frontend)
      // ============================================
      // The JWT token received from adminLogin mutation is stored in localStorage
      // under the key "token". This token will be automatically included in all
      // subsequent GraphQL API calls via the Apollo Client authLink (see lib/apollo-client.ts)
      //
      // Storage location: localStorage.setItem("token", ...)
      // Token format: JWT string (e.g., "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
      // Token contains: { id, email, role } where role is "Admin" or "SuperAdmin"
      // ============================================
      const loginData = data?.adminLogin;
      if (loginData?.token) {
        // Store the JWT token in localStorage for use in all admin API calls
        localStorage.setItem("token", loginData.token);
        // Store admin user data for quick access (optional, token already contains this)
        localStorage.setItem("user", JSON.stringify(loginData.admin));

        // Show success notification
        showNotification("success", "Login successful! Redirecting...", 2000);

        // Redirect after a short delay to show the notification
        setTimeout(() => {
          router.push("/admin/users");
        }, 1000);
      }
    } catch (err) {
      console.error("Login Error:", err);
      const error = err as ApolloError;
      // Show error notification
      showNotification(
        "error",
        error.message || "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--blue-old)] mb-2">
              Admin Login
            </h1>
            <p className="text-[var(--blue-medium)] text-sm">
              Enter your credentials to access the admin panel
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--blue-dark)] mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[var(--blue-medium-dark)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] text-black placeholder:text-[var(--blue-medium)]"
                placeholder="admin@vedascholars.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--blue-dark)] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[var(--blue-medium-dark)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] text-black placeholder:text-[var(--blue-medium)]"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  {/* Loading Spinner */}
                  <svg
                    className="animate-spin h-5 w-5 text-[var(--blue-darkest)]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
