"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, gql } from "@apollo/client";
import { Loader2 } from "lucide-react";
import Captcha from "../Captcha";

// GraphQL Queries & Mutations
const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      phone
      interest
      preferredCountry
      qualification
      resumeUrl
      notes
      role
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $name: String
    $phone: String
    $interest: UserInterest
    $preferredCountry: String
    $qualification: String
    $resumeUrl: String
    $notes: String
  ) {
    updateProfile(
      name: $name
      phone: $phone
      interest: $interest
      preferredCountry: $preferredCountry
      qualification: $qualification
      resumeUrl: $resumeUrl
      notes: $notes
    ) {
      id
      name
      phone
      interest
      preferredCountry
      qualification
      resumeUrl
      notes
    }
  }
`;

// Zod Schema
const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    interest: z.enum(["StudyAbroad", "Job"]).optional(),
    preferredCountry: z.string().optional(),
    qualification: z.string().optional(),
    resumeUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    notes: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileForm = () => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef(true);

    const { data: userData, loading: userLoading, error: userError } = useQuery(GET_ME);
    const [updateProfile, { loading: updateLoading }] = useMutation(UPDATE_PROFILE);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (userData?.me) {
            const user = userData.me;
            setValue("name", user.name || "");
            setValue("phone", user.phone || "");
            setValue("interest", user.interest || "StudyAbroad");
            setValue("preferredCountry", user.preferredCountry || "");
            setValue("qualification", user.qualification || "");
            setValue("resumeUrl", user.resumeUrl || "");
            setValue("notes", user.notes || "");
        }
    }, [userData, setValue]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (successTimeoutRef.current) {
                clearTimeout(successTimeoutRef.current);
            }
        };
    }, []);

    const onSubmit = async (data: ProfileFormData) => {
        setSuccessMessage(null);
        setError(null);

        // CAPTCHA validation
        if (!captchaToken) {
            setError("Please complete the CAPTCHA verification");
            return;
        }

        try {
            await updateProfile({
                variables: {
                    ...data,
                    // Ensure empty strings are sent as null if needed, or keep as is
                },
            });

            // Only update state if component is still mounted
            if (!isMountedRef.current) return;

            setSuccessMessage("Profile updated successfully!");

            // Clear any existing timeout
            if (successTimeoutRef.current) {
                clearTimeout(successTimeoutRef.current);
            }
            // Auto-dismiss after 3 seconds
            successTimeoutRef.current = setTimeout(() => {
                if (isMountedRef.current) {
                    setSuccessMessage(null);
                }
                successTimeoutRef.current = null;
            }, 3000);
        } catch (err: any) {
            // Only update state if component is still mounted
            if (!isMountedRef.current) return;
            
            console.error("Update Error:", err);
            setError(err.message || "Failed to update profile");
        }
    };

    if (userLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
            </div>
        );
    }

    if (userError) {
        return (
            <div className="text-red-500 text-center p-4">
                Error loading profile: {userError.message}
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                My Profile
            </h2>

            {successMessage && (
                <div className="fixed top-24 right-8 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-white/20 p-1 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="font-medium">{successMessage}</span>
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input
                            {...register("name")}
                            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/20 focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                        <input
                            {...register("phone")}
                            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/20 focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                            placeholder="+1 234 567 890"
                        />
                        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                    </div>

                    {/* Email (Read Only) */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address (Cannot be changed)</label>
                        <input
                            value={userData?.me?.email || ""}
                            disabled
                            className="w-full px-4 py-2 rounded-lg border border-white/5 bg-white/5 text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    {/* Interest */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Primary Interest</label>
                        <select
                            {...register("interest")}
                            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/20 focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all text-white"
                        >
                            <option value="StudyAbroad" className="bg-gray-900">Study Abroad</option>
                            <option value="Job" className="bg-gray-900">Job Search</option>
                        </select>
                    </div>

                    {/* Preferred Country */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Preferred Country</label>
                        <input
                            {...register("preferredCountry")}
                            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/20 focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                            placeholder="e.g. USA, UK, Canada"
                        />
                    </div>

                    {/* Qualification */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Highest Qualification</label>
                        <input
                            {...register("qualification")}
                            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/20 focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                            placeholder="e.g. Bachelor's in Computer Science"
                        />
                    </div>

                    {/* Resume URL */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Resume / Portfolio URL</label>
                        <input
                            {...register("resumeUrl")}
                            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/20 focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                            placeholder="https://linkedin.com/in/..."
                        />
                        {errors.resumeUrl && <p className="text-red-400 text-xs mt-1">{errors.resumeUrl.message}</p>}
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Additional Notes</label>
                        <textarea
                            {...register("notes")}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/20 focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                            placeholder="Any specific requirements or goals..."
                        />
                    </div>
                </div>

                <Captcha 
                    onChange={(token) => setCaptchaToken(token)}
                    onExpired={() => setCaptchaToken(null)}
                    onError={() => {
                        setCaptchaToken(null);
                        setError("CAPTCHA verification failed. Please try again.");
                    }}
                />

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={updateLoading || !captchaToken}
                        className="px-8 py-3 bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-gray-900 font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {updateLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
