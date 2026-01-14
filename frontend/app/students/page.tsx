"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Globe,
  Award,
  Users,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function StudentsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Do you charge students for your services?",
      answer:
        "Our initial consultation is completely free. For advanced services like visa processing and personalized career coaching, we have transparent pricing packages. Many of our placement services are funded by our partner employers.",
    },
    {
      question: "Which countries do you help students find jobs in?",
      answer:
        "We specialize in placements across the UK, USA, Canada, Australia, Germany, UAE, and Singapore. We're constantly expanding our network to new regions.",
    },
    {
      question: "Can you help with visa sponsorship?",
      answer:
        "Yes! This is our core expertise. We connect you specifically with employers who are licensed to sponsor visas, and our legal partners guide you through the application process.",
    },
    {
      question: "Do I need work experience to apply?",
      answer:
        "We have opportunities for all levels, from fresh graduates looking for internships to experienced professionals seeking senior roles. Our 'Skill Development' program can also help bridge any experience gaps.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] overflow-hidden pt-20">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--gold)]/5 blur-3xl rounded-full pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-500/10 blur-3xl rounded-full pointer-events-none animate-pulse delay-1000" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse"></span>
                <span className="text-[var(--gold)] font-semibold text-sm tracking-wide">
                  For Students
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Launch Your{" "}
                <span className="text-[var(--gold)]">Global Career</span>
              </h1>
              <p className="text-sm md:text-base text-white/90 mb-8 leading-relaxed max-w-lg">
                Connect with international employers, secure visa sponsorship,
                and build the career you&apos;ve always dreamed of. We support
                students at every step of their journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup?role=student">
                  <Button
                    variant="primary"
                    className="bg-[var(--gold)] text-[var(--blue-darkest)] hover:bg-white hover:text-[var(--blue-darkest)] border-none font-bold text-lg px-8 py-4 w-full sm:w-auto shadow-[0_0_20px_var(--gold-glow-medium)] hover:shadow-[0_0_30px_var(--gold-glow-strong)] transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Find Jobs Now
                  </Button>
                </Link>
                <Link href="/under-development">
                  <Button
                    variant="outline"
                    className="px-8 py-4 text-lg w-full sm:w-auto hover:scale-105 transition-all"
                  >
                    Book Your Free Counselling Today!
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl animate-fade-in-delay transform hover:scale-[1.02] transition-transform duration-500 group">
              <Image
                src="/student_page/heroStudent.jpg"
                alt="Students success"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="font-bold text-lg">
                  Join 500+ Successful Graduates
                </p>
                <p className="text-sm text-white/80">
                  Start your journey today
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Marquee */}
      {/* <section className="bg-[var(--blue-darkest)] py-16 overflow-hidden border-y border-[var(--blue-dark)] relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
                <div className="max-w-7xl mx-auto px-4 mb-10 text-center relative z-10">
                    <p className="text-[var(--gold)] text-sm font-bold uppercase tracking-[0.2em]">Trusted by Global Industry Leaders</p>
                </div>

                <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
                    <div className="flex w-[200%] animate-scroll hover:[animation-play-state:paused]">
                        <div className="flex justify-around w-1/2 shrink-0 items-center gap-16 px-4">
                            {[
                                { name: "Google", domain: "google.com" },
                                { name: "Microsoft", domain: "microsoft.com" },
                                { name: "Amazon", domain: "amazon.com" },
                                { name: "Deloitte", domain: "deloitte.com" },
                                { name: "KPMG", domain: "kpmg.com" },
                                { name: "Infosys", domain: "infosys.com" },
                                { name: "TCS", domain: "tcs.com" },
                                { name: "Accenture", domain: "accenture.com" },
                                { name: "Wipro", domain: "wipro.com" },
                                { name: "Capgemini", domain: "capgemini.com" },
                                { name: "IBM", domain: "ibm.com" },
                                { name: "Oracle", domain: "oracle.com" },
                            ].map((partner, i) => (
                                <div key={i} className="relative h-12 w-32 transition-all duration-300 hover:scale-110 cursor-pointer">
                                    <img
                                        src={`https://logo.clearbit.com/${partner.domain}`}
                                        alt={partner.name}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-around w-1/2 shrink-0 items-center gap-16 px-4">
                            {[
                                { name: "Google", domain: "google.com" },
                                { name: "Microsoft", domain: "microsoft.com" },
                                { name: "Amazon", domain: "amazon.com" },
                                { name: "Deloitte", domain: "deloitte.com" },
                                { name: "KPMG", domain: "kpmg.com" },
                                { name: "Infosys", domain: "infosys.com" },
                                { name: "TCS", domain: "tcs.com" },
                                { name: "Accenture", domain: "accenture.com" },
                                { name: "Wipro", domain: "wipro.com" },
                                { name: "Capgemini", domain: "capgemini.com" },
                                { name: "IBM", domain: "ibm.com" },
                                { name: "Oracle", domain: "oracle.com" },
                            ].map((partner, i) => (
                                <div key={`dup-${i}`} className="relative h-12 w-32 transition-all duration-300 hover:scale-110 cursor-pointer">
                                    <img
                                        src={`https://logo.clearbit.com/${partner.domain}`}
                                        alt={partner.name}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section> */}

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--blue-darkest)] mb-4">
              Why Choose Veda Scholars?
            </h2>
            <p className="text-sm md:text-base text-[var(--blue-medium)] max-w-3xl mx-auto">
              We go beyond just job listings. We build your entire international
              career path.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Global Network",
                desc: "Direct partnerships with 200+ companies across 15 countries.",
              },
              {
                icon: CheckCircle,
                title: "Verified Employers",
                desc: "Every job listing is vetted to ensure genuine visa sponsorship.",
              },
              {
                icon: Users,
                title: "Community Support",
                desc: "Join a thriving community of students and alumni for peer guidance.",
              },
              {
                icon: Award,
                title: "Proven Success",
                desc: "95% of our students secure a job within 3 months of graduation.",
              },
              {
                icon: BookOpen,
                title: "Expert Coaching",
                desc: "Resume reviews and mock interviews by industry veterans.",
              },
              {
                icon: Globe,
                title: "End-to-End Support",
                desc: "From your first application to your first day at work, we're with you.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-[var(--blue-medium-dark)]/10 border border-[var(--blue-medium-dark)]/20 hover:border-[var(--gold)]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-7 h-7 text-[var(--gold)]" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-[var(--blue-darkest)] mb-3 group-hover:text-[var(--gold)] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-[var(--blue-medium)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Life Gallery */}
      <section className="py-20 px-4 lg:px-8 bg-[var(--blue-darkest)] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Student Life
              </h2>
              <p className="text-sm md:text-base text-white/60 max-w-xl">
                See what it&apos;s like to be part of the Veda Scholars global
                community.
              </p>
            </div>
            {/* <Link href="/gallery">
                            <Button variant="outline" className="border-[var(--blue-medium-dark)] text-white hover:bg-[var(--blue-dark)] hover:border-[var(--blue-medium)]">
                                View Full Gallery
                            </Button>
                        </Link> */}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px]">
            <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group">
              <Image
                src="/student_page/student_life1.jpg"
                alt="Student Life"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
            <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group">
              <Image
                src="/student_page/student_life2.jpg"
                alt="Student Life"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
              />
            </div>
            <div className="col-span-1 row-span-2 relative rounded-2xl overflow-hidden group">
              <Image
                src="/student_page/student_life3.jpeg"
                alt="Student Life"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
              />
            </div>
            <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group">
              <Image
                src="/student_page/student_life4.jpg"
                alt="Student Life"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 lg:px-8 bg-[var(--blue-medium-dark)]/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--blue-darkest)] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm md:text-base text-[var(--blue-medium)]">
              Everything you need to know about starting your journey
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-[var(--blue-medium-dark)]/20 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="text-sm md:text-base font-semibold text-[var(--blue-darkest)]">
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-[var(--gold)]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[var(--blue-light)]" />
                  )}
                </button>
                <div
                  className={`px-8 transition-all duration-300 ease-in-out ${
                    openFaq === index
                      ? "max-h-48 pb-8 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm md:text-base text-[var(--blue-medium)] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 lg:px-8 bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/globe.svg')] opacity-5 bg-center bg-no-repeat bg-contain pointer-events-none animate-spin-slow" />

        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Launch Your Global Career?
          </h2>
          <p className="text-sm md:text-base text-white/90 mb-10 leading-relaxed">
            Join thousands of students who have successfully secured jobs with
            visa sponsorship through Veda Scholars
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup?role=student">
              <Button
                variant="primary"
                className="px-12 py-5 text-xl font-bold shadow-2xl hover:shadow-[0_0_30px_var(--gold-glow-alt-strong)] hover:scale-105 transition-all w-full sm:w-auto"
              >
                Get Started Today
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-white/60 text-sm">
            No credit card required for initial consultation
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
