"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, gql } from "@apollo/client";
import { Loader2, MapPin, Briefcase, DollarSign, Calendar, ArrowLeft } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/Button";

const GET_JOB = gql`
  query GetJob($id: ID!) {
    job(id: $id) {
      id
      title
      company
      location
      type
      description
      experienceRequired
      salary
      createdAt
    }
  }
`;

export default function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const { data, loading, error } = useQuery(GET_JOB, {
        variables: { id },
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--gold)]" />
            </div>
        );
    }

    if (error || !data?.job) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-red-500 text-lg mb-4">Job not found or error loading details.</p>
                <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    const job = data.job;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-500 hover:text-[var(--gold)] transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Jobs
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                                <div className="text-xl text-gray-600 font-medium mb-4">{job.company}</div>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" />
                                        {job.location}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Briefcase className="w-4 h-4" />
                                        {job.type}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <DollarSign className="w-4 h-4" />
                                        {job.salary || "Not specified"}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        Posted {new Date(job.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-shrink-0">
                                <Button
                                    variant="primary"
                                    className="px-8 py-3 bg-[var(--gold)] text-gray-900 font-bold hover:bg-[var(--gold-hover)]"
                                    onClick={() => router.push(`/jobs/${job.id}/apply`)}
                                >
                                    Apply Now
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                            <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                                {job.description}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                            <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                                {job.experienceRequired}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
