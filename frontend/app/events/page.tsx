"use client";

import { Calendar } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";

export default function EventsPage() {

    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] min-h-screen text-white selection:bg-[var(--gold)] selection:text-[var(--blue-darkest)]">
                {/* Background Gradients */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[var(--blue-medium-dark)]/10 rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[var(--gold)]/5 rounded-full blur-[150px]"></div>
                </div>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 z-10">
                    <div className="max-w-7xl mx-auto px-4 lg:px-8">
                        <div className="text-center max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 mb-8 backdrop-blur-sm">
                                <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse"></span>
                                <span className="text-[var(--gold)] font-semibold text-sm tracking-wide">Upcoming Events</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight tracking-tight">
                                Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/80">Events</span>
                            </h1>
                            <p className="text-sm md:text-base text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto px-4 md:px-0">
                                Discover upcoming workshops, fairs, and networking events designed to help you achieve your educational and career goals.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Empty State */}
                <section className="relative z-10 pb-24">
                    <div className="max-w-6xl mx-auto px-4 lg:px-8">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 md:p-16 lg:p-20 shadow-2xl border-2 border-[var(--gold)]/30 relative overflow-hidden">
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[var(--gold)]/20 to-transparent pointer-events-none"></div>
                            
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--gold)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--blue-medium-dark)]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                            
                            <div className="relative z-10 text-center">
                                {/* Icon */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--gold)]/30 to-[var(--gold)]/20 flex items-center justify-center border-2 border-[var(--gold)]/40 shadow-[0_0_30px_var(--gold-glow-medium)]">
                                        <Calendar className="w-10 h-10 text-[var(--gold)]" />
                                    </div>
                                </div>
                                
                                {/* Heading */}
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                                    No Events Yet
                                </h2>
                                
                                {/* Description */}
                                <p className="text-base md:text-lg text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed px-4">
                                    We&apos;re currently planning exciting events and workshops. Check back soon for updates on upcoming study abroad fairs, career workshops, and networking opportunities.
                                </p>
                                
                                {/* Decorative Line */}
                                <div className="flex items-center justify-center gap-4 mb-8">
                                    <div className="h-px w-20 bg-gradient-to-r from-transparent to-[var(--gold)]"></div>
                                    <div className="w-2 h-2 rounded-full bg-[var(--gold)] shadow-[0_0_15px_var(--gold-glow-medium)]"></div>
                                    <div className="h-px w-20 bg-gradient-to-l from-transparent to-[var(--gold)]"></div>
                                </div>
                                
                                {/* CTA */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        variant="primary"
                                        href="/get-in-touch"
                                        className="shadow-[0_0_20px_var(--gold-glow-medium)] hover:shadow-[0_0_30px_var(--gold-glow-strong)]"
                                    >
                                        Get Notified
                                    </Button>
                                    <Button
                                        variant="outline"
                                        href="/"
                                        className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                                    >
                                        Back to Home
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}

