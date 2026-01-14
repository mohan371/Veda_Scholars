"use client";

import React, { Suspense } from "react";
import { AuthForm } from "../../components/auth/AuthForm";

function LoginContent() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] flex items-center justify-center p-4">
            <AuthForm initialMode="login" />
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
