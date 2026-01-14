"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Briefcase } from "lucide-react";

const RoleSelectionPage = () => {
    const roles = [
        {
            id: "student",
            title: "Student",
            description: "Looking for universities and courses",
            icon: GraduationCap,
            href: "/auth/signup?role=student",
        },
        {
            id: "job_applicant",
            title: "Job Applicant",
            description: "Searching for job opportunities",
            icon: Briefcase,
            href: "/auth/signup?role=job_applicant",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] flex items-center justify-center p-4 relative overflow-hidden">

            {/* Floating Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--gold)]/10 rounded-full blur-3xl animate-pulse delay-0 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"></div>

            {/* Main Outer Card */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-4xl border border-white/20 animate-fade-in relative overflow-hidden z-10">

                {/* Decorative Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* Header Section */}
                <div className="flex flex-col items-center mb-10 text-center relative z-10">
                    <div className="relative w-24 h-24 mb-6 transform hover:scale-110 hover:rotate-3 transition-all duration-500 cursor-pointer">
                        <Image
                            src="/logo.png"
                            alt="Veda Scholars Logo"
                            fill
                            className="object-contain drop-shadow-xl"
                            priority
                        />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-3 bg-gradient-to-r from-gray-900 via-[var(--gold)] to-gray-900 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                        Join Veda Scholars
                    </h1>
                    <p className="text-gray-500 text-lg font-medium">
                        Choose your role to get started
                    </p>
                </div>

                {/* Role Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-delay relative z-10 max-w-2xl mx-auto">
                    {roles.map((role) => (
                        <Link
                            key={role.id}
                            href={role.href}
                            className="group relative flex flex-col items-center p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[var(--blue-darkest)] to-[var(--blue-medium-dark)] hover:border-[var(--gold)] hover:shadow-[0_20px_50px_-12px_var(--gold-shadow-card)] transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-[1.03] overflow-hidden"
                        >
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0 pointer-events-none" />

                            {/* Subtle Gradient Overlay on Hover */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            {/* Icon Circle */}
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[var(--gold)]/20 group-hover:shadow-[0_0_30px_var(--gold-glow-alt-strong)] transition-all duration-500 relative z-10 group-hover:rotate-[10deg]">
                                <role.icon className="w-10 h-10 text-[var(--gold)] drop-shadow-sm transition-transform duration-500 group-hover:scale-110" />
                            </div>

                            {/* Text Content */}
                            <h3 className="text-xl font-bold text-white mb-3 tracking-wide group-hover:text-[var(--gold)] transition-colors duration-300 relative z-10">
                                {role.title}
                            </h3>
                            <p className="text-center text-gray-300 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300 relative z-10">
                                {role.description}
                            </p>
                        </Link>
                    ))}
                </div>

                {/* Footer / Login Link */}
                <div className="mt-8 text-center relative z-10">
                    <p className="text-[var(--blue-medium)] text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-[var(--gold)] font-semibold hover:underline hover:text-yellow-600 transition-colors">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionPage;
