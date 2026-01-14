"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AdminNavbar from "./components/AdminNavbar";
import AdminSidebar from "./components/AdminSidebar";

import { JWTPayload } from "../../types";

/**
 * Helper function to decode JWT token payload (without verification)
 * JWT tokens have 3 parts: header.payload.signature
 * The payload is base64url encoded JSON, so we can decode it on the client
 * Note: This doesn't verify the signature - that's done on the backend
 */
const decodeJWTPayload = (token: string): JWTPayload | null => {
  try {
    // Split token into parts: [header, payload, signature]
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    // Decode the payload (second part)
    // Base64url decoding: replace - with +, _ with /, and add padding if needed
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin" || pathname === "/admin/";
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication and role for all admin pages except login
  useEffect(() => {
    if (!isLoginPage) {
      // Get token from localStorage (stored during admin login)
      const token = localStorage.getItem("token");
      
      if (!token) {
        // No token found, redirect to admin login
        router.push("/admin");
        return;
      }

      // Decode token to check if user is an admin
      // Token payload contains: { id, email, role }
      const payload = decodeJWTPayload(token);
      
      if (!payload) {
        // Invalid token format, redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin");
        return;
      }

      // Check if the token belongs to an admin (not a regular user/student)
      // Admin roles: "Admin" or "SuperAdmin"
      // User roles: "Student" or other non-admin roles
      const isAdmin = payload.role === "Admin" || payload.role === "SuperAdmin";
      
      if (!isAdmin) {
        // User is not an admin, redirect to home page
        // This prevents regular users from accessing admin pages
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
        return;
      }

      setIsCheckingAuth(false);
    } else {
      setIsCheckingAuth(false);
    }
  }, [pathname, isLoginPage, router]);

  // Don't show navbar and sidebar on login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <AdminSidebar onCollapseChange={setIsSidebarCollapsed} />
      <main
        className={`pt-16 min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

