"use client";

import React, { Suspense } from "react";
import Navbar from "../components/Navbar";
import { ProfileForm } from "../components/profile/ProfileForm";

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)]">
            <Navbar />

            <main className="container mx-auto px-4 py-24">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-white mb-2">Your Profile</h1>
                        <p className="text-white/80">Manage your personal information and preferences</p>
                    </div>

                    <Suspense fallback={<div className="text-white text-center">Loading profile...</div>}>
                        <ProfileForm />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}
