"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Button from "../../../components/Button";
import Captcha from "../../../components/Captcha";

// GraphQL
const GET_JOB_TITLE = gql`
  query GetJobTitle($id: ID!) {
    job(id: $id) {
      id
      title
      company
    }
  }
`;

const APPLY_FOR_JOB = gql`
  mutation ApplyForJob(
    $jobId: ID!
    $name: String!
    $email: String!
    $phone: String!
    $resumeUrl: String!
  ) {
    applyForJob(
      jobId: $jobId
      name: $name
      email: $email
      phone: $phone
      resumeUrl: $resumeUrl
    )
  }
`;

// Schema
const applySchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    resumeUrl: z.string().url("Invalid URL"),
});

type ApplyFormData = z.infer<typeof applySchema>;

export default function ApplyJobPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const [isSuccess, setIsSuccess] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef(true);

    const { data: jobData, loading: jobLoading } = useQuery(GET_JOB_TITLE, {
        variables: { id },
    });

    const [applyForJob, { loading: applying, error: applyError }] = useMutation(APPLY_FOR_JOB);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ApplyFormData>({
        resolver: zodResolver(applySchema),
    });

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
            }
        };
    }, []);

    const onSubmit = async (data: ApplyFormData) => {
        // CAPTCHA validation
        if (!captchaToken) {
            return;
        }

        try {
            await applyForJob({
                variables: {
                    jobId: id,
                    ...data,
                },
            });

            // Only update state if component is still mounted
            if (!isMountedRef.current) return;

            setIsSuccess(true);
            // Clear any existing timeout
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
            }
            // Redirect after 3 seconds
            redirectTimeoutRef.current = setTimeout(() => {
                if (isMountedRef.current) {
                    router.push("/jobs/search");
                }
                redirectTimeoutRef.current = null;
            }, 3000);
        } catch (err) {
            // Only log if component is still mounted
            if (isMountedRef.current) {
                console.error("Application Error:", err);
            }
        }
    };

    if (jobLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--gold)]" />
            </div>
        );
    }

    if (!jobData?.job) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-red-500 text-lg mb-4">Job not found.</p>
                <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center px-4">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Sent!</h2>
                        <p className="text-gray-600 mb-6">
                            Your application for <span className="font-semibold">{jobData.job.title}</span> at <span className="font-semibold">{jobData.job.company}</span> has been submitted successfully.
                        </p>
                        <p className="text-sm text-gray-400">Redirecting to jobs...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-500 hover:text-[var(--gold)] transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Job Details
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply for {jobData.job.title}</h1>
                        <p className="text-gray-600">{jobData.job.company}</p>
                    </div>

                    <div className="p-8">
                        {applyError && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
                                {applyError.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    {...register("name")}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all"
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    {...register("email")}
                                    type="email"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    {...register("phone")}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all"
                                    placeholder="+1 234 567 890"
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resume / Portfolio URL</label>
                                <input
                                    {...register("resumeUrl")}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all"
                                    placeholder="https://linkedin.com/in/..."
                                />
                                {errors.resumeUrl && <p className="text-red-500 text-xs mt-1">{errors.resumeUrl.message}</p>}
                            </div>

                            <Captcha 
                                onChange={(token) => setCaptchaToken(token)}
                                onExpired={() => setCaptchaToken(null)}
                                onError={() => {
                                    setCaptchaToken(null);
                                }}
                            />

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={applying || !captchaToken}
                                    className="w-full py-3 bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-gray-900 font-bold rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {applying ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Application"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
