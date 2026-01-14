"use client";

import Image from "next/image";
import { CheckCircle, Globe, Users, Award, BookOpen, ArrowRight, Eye, Target, Handshake, GraduationCap, Briefcase, BookOpen as BookOpenIcon, FileText, Plane, Building2, UserCheck, MessageSquare, Languages, Code, BriefcaseBusiness } from "lucide-react";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutUsPage() {
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
                            <span className="text-[var(--gold)] font-semibold text-sm tracking-wide">About Veda Scholars</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight tracking-tight">
                            Empowering Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/80">Ambitions</span>
                        </h1>
                        <p className="text-sm md:text-base text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto px-4 md:px-0">
                            To empower individuals with world-class education pathways and global career opportunities through ethical, transparent, and innovative guidance.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5 justify-center">
                            <Button variant="primary" href="/auth/role-selection" className="shadow-[0_0_20px_var(--gold-glow-alt-medium)] hover:shadow-[0_0_30px_var(--gold-glow-alt-strong)] transition-shadow">
                                Join Our Community
                            </Button>
                            <Button variant="outline" href="/universities" className="backdrop-blur-sm">
                                @Universities
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Overview Section */}
            <section className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    {/* Mission Section */}
                    <section className="mb-32 relative z-10">
                        <div className="max-w-4xl mx-auto px-4 lg:px-8">
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 mb-8 backdrop-blur-sm">
                                    <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse"></span>
                                    <span className="text-[var(--gold)] font-semibold text-sm tracking-wide">Our Mission</span>
                                </div>
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight tracking-tight text-white">
                                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/80">Commitment</span>
                                </h3>
                                <ul className="space-y-5 text-left max-w-3xl mx-auto">
                                    {[
                                        "Deliver personalized and reliable counseling.",
                                        "Connect students with reputable global universities.",
                                        "Provide skill training to enhance employability.",
                                        "Support industries with qualified, job-ready talent.",
                                        "Maintain honesty, compliance, and quality in every service."
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--gold)]/20 flex items-center justify-center mt-1">
                                                <CheckCircle className="text-[var(--gold)] w-4 h-4" />
                                            </div>
                                            <span className="text-sm md:text-base text-white/90 font-medium leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Why Partner With Us Section */}
                    <section className="mb-32 relative z-10">
                        <div className="max-w-4xl mx-auto px-4 lg:px-8">
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 mb-8 backdrop-blur-sm">
                                    <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse"></span>
                                    <span className="text-[var(--gold)] font-semibold text-sm tracking-wide">Partnership</span>
                                </div>
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight tracking-tight text-white">
                                    Why Partner <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/80">With Us</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
                                    {[
                                        "Strong global network of universities & employers.",
                                        "End-to-end solutions under one roof.",
                                        "Transparent & ethical operations.",
                                        "Trained, filtered & job-ready candidates.",
                                        "Premium support for institutions & industries.",
                                        "Proven success in admissions & placements."
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--gold)]/20 flex items-center justify-center mt-1">
                                                <CheckCircle className="text-[var(--gold)] w-4 h-4" />
                                            </div>
                                            <span className="text-sm md:text-base text-white/90 font-medium leading-relaxed">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Our Services Section */}
                    <div className="mb-32 relative z-10">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 mb-8 backdrop-blur-sm">
                                <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse"></span>
                                <span className="text-[var(--gold)] font-semibold text-sm tracking-wide">Our Services</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight tracking-tight">
                                Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/80">Solutions</span>
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Higher Education Consultancy */}
                            <div className="bg-white/5 backdrop-blur-sm p-10 rounded-3xl hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-[var(--gold)]/30 hover:-translate-y-2">
                                <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-2xl flex items-center justify-center text-[var(--gold)] mb-8 group-hover:scale-110 transition-transform duration-300">
                                    <GraduationCap className="w-8 h-8" />
                                </div>
                                <h4 className="text-sm md:text-base font-bold text-white mb-6">HIGHER EDUCATION CONSULTANCY</h4>
                                <ul className="space-y-4">
                                    {[
                                        { icon: <BookOpenIcon className="w-5 h-5" />, text: "Career Counseling" },
                                        { icon: <Globe className="w-5 h-5" />, text: "University Selection" },
                                        { icon: <FileText className="w-5 h-5" />, text: "Admission Support" },
                                        { icon: <FileText className="w-5 h-5" />, text: "SOP & Document Help" },
                                        { icon: <Award className="w-5 h-5" />, text: "Scholarships" },
                                        { icon: <Plane className="w-5 h-5" />, text: "Visa Guidance" },
                                        { icon: <Plane className="w-5 h-5" />, text: "Pre-Departure Support" }
                                    ].map((service, index) => (
                                        <li key={index} className="flex items-center gap-3 text-white/80 group-hover:text-white transition-colors">
                                            <div className="text-[var(--gold)]">{service.icon}</div>
                                            <span className="text-sm md:text-base font-medium">{service.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Recruitment & Placement */}
                            <div className="bg-white/5 backdrop-blur-sm p-10 rounded-3xl hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-[var(--gold)]/30 hover:-translate-y-2">
                                <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-2xl flex items-center justify-center text-[var(--gold)] mb-8 group-hover:scale-110 transition-transform duration-300">
                                    <Briefcase className="w-8 h-8" />
                                </div>
                                <h4 className="text-sm md:text-base font-bold text-white mb-6">RECRUITMENT & PLACEMENT</h4>
                                <ul className="space-y-4">
                                    {[
                                        { icon: <Globe className="w-5 h-5" />, text: "International Hiring" },
                                        { icon: <Building2 className="w-5 h-5" />, text: "Domestic Placement" },
                                        { icon: <UserCheck className="w-5 h-5" />, text: "Screening & Assessment" },
                                        { icon: <MessageSquare className="w-5 h-5" />, text: "Interview Training" },
                                        { icon: <Plane className="w-5 h-5" />, text: "Work Visa Support" },
                                        { icon: <Users className="w-5 h-5" />, text: "Mobilization & Onboarding" }
                                    ].map((service, index) => (
                                        <li key={index} className="flex items-center gap-3 text-white/80 group-hover:text-white transition-colors">
                                            <div className="text-[var(--gold)]">{service.icon}</div>
                                            <span className="text-sm md:text-base font-medium">{service.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Training & Skill Development */}
                            <div className="bg-white/5 backdrop-blur-sm p-10 rounded-3xl hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-[var(--gold)]/30 hover:-translate-y-2">
                                <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-2xl flex items-center justify-center text-[var(--gold)] mb-8 group-hover:scale-110 transition-transform duration-300">
                                    <BookOpenIcon className="w-8 h-8" />
                                </div>
                                <h4 className="text-sm md:text-base font-bold text-white mb-6">TRAINING & SKILL DEVELOPMENT</h4>
                                <ul className="space-y-4">
                                    {[
                                        { icon: <Languages className="w-5 h-5" />, text: "IELTS / PTE Training" },
                                        { icon: <MessageSquare className="w-5 h-5" />, text: "Communication Skills" },
                                        { icon: <Code className="w-5 h-5" />, text: "Technical Job Training" },
                                        { icon: <Code className="w-5 h-5" />, text: "Digital / IT Skills" },
                                        { icon: <BriefcaseBusiness className="w-5 h-5" />, text: "Workplace Etiquette" }
                                    ].map((service, index) => (
                                        <li key={index} className="flex items-center gap-3 text-white/80 group-hover:text-white transition-colors">
                                            <div className="text-[var(--gold)]">{service.icon}</div>
                                            <span className="text-sm md:text-base font-medium">{service.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who We Are Section */}
            <section className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--gold)] to-[var(--blue-medium-dark)] rounded-2xl opacity-30 blur-lg group-hover:opacity-50 transition duration-500"></div>
                            <div className="relative h-[500px] lg:h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                <Image
                                    src="/founder.png"
                                    alt="Harish J - Founder of Veda Scholars"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    priority
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--blue-darkest)] via-transparent to-transparent opacity-60"></div>
                                <div className="absolute bottom-10 left-10 right-10">
                                    <p className="text-sm font-bold uppercase tracking-widest text-[var(--gold)] mb-3">Established 2025</p>
                                    <h3 className="text-2xl md:text-3xl font-bold leading-snug text-white">Building futures, one student at a time.</h3>
                                </div>
                            </div>

                            {/* Floating card */}
                            <div className="absolute -bottom-10 -right-10 bg-[var(--blue-darkest)] p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-xs hidden md:block border border-white/10 backdrop-blur-xl">
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="p-4 bg-[var(--gold)]/10 rounded-full text-[var(--gold)]">
                                        <Users size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/60 font-medium uppercase tracking-wide">Community</p>
                                        <p className="text-2xl font-bold text-white">10,000+</p>
                                    </div>
                                </div>
                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div className="bg-[var(--gold)] h-full w-3/4"></div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                                Who We <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/80">Are</span>
                            </h2>
                            <p className="text-sm md:text-base text-white/90 mb-8 leading-relaxed">
                                Veda Scholars is more than just an education consultancy; we are a technology-driven platform dedicated to democratizing access to global education. Founded by alumni from top international universities, we understand the challenges and aspirations of students seeking to study abroad.
                            </p>
                            <p className="text-sm md:text-base text-white/90 mb-10 leading-relaxed">
                                Our mission is to simplify the complex journey of international admissions through transparency, personalized guidance, and a robust support network.
                            </p>

                            <ul className="space-y-5">
                                {[
                                    "Personalized Career Counseling",
                                    "Verified University Partnerships",
                                    "End-to-End Visa Assistance",
                                    "Post-Arrival Support"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-4 group">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--gold)]/20 flex items-center justify-center group-hover:bg-[var(--gold)] transition-colors">
                                            <CheckCircle className="text-[var(--gold)] w-4 h-4 group-hover:text-[var(--primary)] transition-colors" />
                                        </div>
                                        <span className="text-sm md:text-base text-white/90 font-medium group-hover:text-white transition-colors">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values / Why Choose Us */}
            <section className="py-24 bg-white/5 relative z-10">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Why Choose Veda Scholars?</h2>
                        <p className="text-sm md:text-base text-white/80">
                            We are committed to excellence, integrity, and student success. Here is what sets us apart.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Globe className="w-8 h-8" />,
                                title: "Global Network",
                                description: "Access to 500+ top-tier universities across the UK, USA, Canada, and Australia."
                            },
                            {
                                icon: <Award className="w-8 h-8" />,
                                title: "Expert Guidance",
                                description: "Mentorship from alumni and industry experts who have walked the path."
                            },
                            {
                                icon: <BookOpen className="w-8 h-8" />,
                                title: "Transparent Process",
                                description: "No hidden fees or biased recommendations. Your future is our priority."
                            },
                            {
                                icon: <Users className="w-8 h-8" />,
                                title: "Community First",
                                description: "Join a vibrant community of scholars, mentors, and peers supporting each other."
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-sm p-10 rounded-3xl hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-[var(--gold)]/30 hover:-translate-y-2">
                                <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-2xl flex items-center justify-center text-[var(--gold)] mb-8 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-sm md:text-base font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-sm md:text-base text-white/80 leading-relaxed group-hover:text-white transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 relative z-10 border-y border-white/5 bg-white/5">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center divide-x divide-white/10">
                        {[
                            { number: "500+", label: "Universities" },
                            { number: "10k+", label: "Students Helped" },
                            { number: "98%", label: "Visa Success Rate" },
                            { number: "$5M+", label: "Scholarships Secured" }
                        ].map((stat, index) => (
                            <div key={index} className="p-4">
                                <div className="text-5xl lg:text-6xl font-bold text-[var(--gold)] mb-4 tracking-tight">{stat.number}</div>
                                <div className="text-white/80 font-medium text-lg uppercase tracking-widest text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative z-10 bg-white">
                <div className="max-w-6xl mx-auto px-4 lg:px-8">
                    <div className="bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden border border-[var(--gold)]/30 shadow-2xl">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--gold)]/10 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--blue-medium-dark)]/10 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">Ready to Start Your Journey?</h2>
                            <p className="text-sm md:text-base text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                                Join thousands of students who have successfully transformed their careers with Veda Scholars.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Button variant="primary" href="/auth/role-selection" className="px-10 py-4 text-lg shadow-[0_0_20px_var(--gold-glow-alt-light)] hover:shadow-[0_0_30px_var(--gold-glow-alt-strong)]">
                                    Get Started Now
                                </Button>
                                <Button variant="outline" className="px-10 py-4 text-lg" href="/get-in-touch">
                                    Contact Support
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
