"use client";

import { useEffect, useState } from "react";
import Button from "../../components/Button";

export default function UniHero() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] overflow-hidden pt-20">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--gold)]/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/4"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 mb-8 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse"></span>
                            <span className="text-[var(--gold)] font-semibold text-sm tracking-wide">For University Partners</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-[1.1]">
                            Empower Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-yellow-200">
                                International Students
                            </span>
                        </h1>

                        <p className="text-base md:text-lg text-white/80 mb-10 leading-relaxed max-w-xl">
                            Boost your international student employability. We provide a dedicated platform for visa-sponsored jobs, internships, and career resources tailored for international graduates.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <Button variant="primary" className="bg-[var(--gold)] text-[var(--blue-darkest)] hover:bg-white hover:text-[var(--blue-darkest)] border-none font-bold text-lg px-8 py-4 shadow-[0_0_20px_var(--gold-glow-medium)] hover:shadow-[0_0_30px_var(--gold-glow-strong)] transition-all duration-300 transform hover:-translate-y-1">
                                Partner With Us
                            </Button>
                            <Button variant="outline" className="font-bold text-lg px-8 py-4 backdrop-blur-sm transition-all duration-300">
                                Request Demo
                            </Button>
                        </div>

                        <div className="mt-12 flex items-center gap-8 text-white/60 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span>GDPR Compliant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span>Instant Setup</span>
                            </div>
                        </div>
                    </div>

                    {/* Graphic Content */}
                    <div className={`relative transition-all duration-1000 delay-300 ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
                        <div className="relative">
                            {/* Main Dashboard Card */}
                            <div className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 backdrop-blur-md p-8 shadow-2xl transform rotate-y-12 hover:rotate-0 transition-transform duration-700 ease-out perspective-1000">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold">Student Activity</div>
                                            <div className="text-xs text-white/60">Live Dashboard</div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/20">
                                        +24% this week
                                    </div>
                                </div>

                                {/* Chart Area */}
                                <div className="space-y-3 mb-8">
                                    <div className="flex items-end gap-2 h-32 pb-2 border-b border-white/5">
                                        {[40, 70, 45, 90, 65, 85, 95].map((h, i) => (
                                            <div key={i} className="flex-1 bg-gradient-to-t from-blue-500/50 to-blue-400/50 rounded-t-sm hover:from-[var(--gold)]/50 hover:to-[var(--gold)]/50 transition-colors duration-300" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-xs text-white/50">
                                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <div className="text-2xl font-bold text-white mb-1">1,240</div>
                                        <div className="text-xs text-white/60">Active Students</div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <div className="text-2xl font-bold text-white mb-1">85%</div>
                                        <div className="text-xs text-white/60">Placement Rate</div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -right-12 -top-12 z-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>

                            <div className="absolute -left-8 bottom-12 z-20 bg-[var(--blue-darkest)]/90 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-xl flex items-center gap-4 animate-bounce-slow">
                                <div className="w-12 h-12 rounded-full bg-[var(--gold)] flex items-center justify-center text-[var(--blue-darkest)] font-bold">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <div className="text-white font-bold">New Job Posted</div>
                                    <div className="text-xs text-white/60">Visa Sponsored • London</div>
                                </div>
                            </div>

                            <div className="absolute -right-4 -bottom-4 z-20 bg-white p-6 rounded-2xl shadow-2xl border border-[var(--blue-medium-dark)]/20 max-w-[200px]">
                                <div className="text-4xl font-bold text-[var(--blue-darkest)] mb-1">500+</div>
                                <div className="text-sm font-medium text-[var(--blue-medium)] leading-tight">Partner Companies Hiring Now</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
