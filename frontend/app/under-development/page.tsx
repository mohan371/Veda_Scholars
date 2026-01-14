"use client";

import Link from "next/link";
import { Construction, Wrench, Hammer, Sparkles, Rocket, ArrowLeft } from "lucide-react";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function UnderDevelopmentPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 lg:left-20 w-32 h-32 lg:w-64 lg:h-64 bg-[var(--gold)]/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 lg:right-20 w-40 h-40 lg:w-80 lg:h-80 bg-[var(--gold)]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 lg:w-96 lg:h-96 bg-[var(--blue-medium-dark)]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="text-center w-full max-w-6xl lg:w-[60%] xl:w-[55%] mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
                    {/* Animated construction icons */}
                    <div className="flex justify-center items-center gap-4 lg:gap-8 mb-8 lg:mb-12">
                        <div className="bg-white/10 p-4 lg:p-8 rounded-full inline-flex items-center justify-center shadow-lg backdrop-blur-sm border border-[var(--gold)]/30 animate-bounce" style={{ animationDelay: '0s' }}>
                            <Construction className="w-12 h-12 lg:w-20 lg:h-20 text-[var(--gold)]" />
                        </div>
                        <div className="bg-white/10 p-4 lg:p-8 rounded-full inline-flex items-center justify-center shadow-lg backdrop-blur-sm border border-[var(--gold)]/30 animate-bounce" style={{ animationDelay: '0.2s' }}>
                            <Wrench className="w-12 h-12 lg:w-20 lg:h-20 text-[var(--gold)]" />
                        </div>
                        <div className="bg-white/10 p-4 lg:p-8 rounded-full inline-flex items-center justify-center shadow-lg backdrop-blur-sm border border-[var(--gold)]/30 animate-bounce" style={{ animationDelay: '0.4s' }}>
                            <Hammer className="w-12 h-12 lg:w-20 lg:h-20 text-[var(--gold)]" />
                        </div>
                    </div>

                    {/* Sparkles decoration */}
                    <div className="flex justify-center gap-2 lg:gap-4 mb-6 lg:mb-8">
                        <Sparkles className="w-5 h-5 lg:w-7 lg:h-7 text-[var(--gold)] animate-pulse" style={{ animationDelay: '0s' }} />
                        <Sparkles className="w-5 h-5 lg:w-7 lg:h-7 text-[var(--gold)] animate-pulse" style={{ animationDelay: '0.3s' }} />
                        <Sparkles className="w-5 h-5 lg:w-7 lg:h-7 text-[var(--gold)] animate-pulse" style={{ animationDelay: '0.6s' }} />
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 lg:mb-10 leading-tight">
                        We're Building Something
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/80 mt-2 lg:mt-4">
                            Amazing!
                        </span>
                    </h1>
                    
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-6 lg:mb-8 leading-relaxed flex items-center justify-center gap-3">
                        <Construction className="w-5 h-5 lg:w-7 lg:h-7 text-[var(--gold)]" />
                        This page is currently under construction
                        <Construction className="w-5 h-5 lg:w-7 lg:h-7 text-[var(--gold)]" />
                    </p>
                    
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-10 lg:mb-14 mx-auto leading-relaxed max-w-4xl">
                        Our team is working hard to bring you an incredible experience. 
                        We'll be launching soon with exciting new features!
                    </p>

                    {/* Progress indicator */}
                    <div className="mb-8 lg:mb-12 px-4">
                        <div className="flex items-center justify-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                            <span className="text-base sm:text-lg lg:text-xl text-white/80 font-medium">Launching Soon</span>
                            <Rocket className="w-5 h-5 lg:w-7 lg:h-7 text-[var(--gold)] animate-bounce" />
                        </div>
                        <div className="w-full max-w-md lg:max-w-lg mx-auto bg-white/10 rounded-full h-2.5 lg:h-3 overflow-hidden backdrop-blur-sm border border-white/10">
                            <div className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/80 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center px-4">
                        <Button 
                            variant="primary" 
                            href="/"
                            className="w-full sm:w-auto shadow-[0_0_20px_var(--gold-glow-medium)] hover:shadow-[0_0_30px_var(--gold-glow-strong)] transition-all hover:-translate-y-1 text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 inline" />
                            Go Back Home
                        </Button>
                        <Button 
                            variant="outline" 
                            href="/get-in-touch"
                            className="w-full sm:w-auto backdrop-blur-sm text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4"
                        >
                            Contact Us
                        </Button>
                    </div>

                </div>
            </div>
            <Footer />
        </main>
    );
}
