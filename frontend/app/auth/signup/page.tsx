"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthForm } from "../../components/auth/AuthForm";

function SignupContent() {
    const searchParams = useSearchParams();
    const role = searchParams.get("role") || "student"; // Default to student if not provided

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] flex items-center justify-center p-4">
            <AuthForm role={role} />
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignupContent />
        </Suspense>
    );
}
