"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from "../../components/Button";

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [currentText, setCurrentText] = useState(0);

  const mainTexts = ["Global Career Companion", "Global Education Partner"];
  const subTexts = ["For Students", "For Universities"];

  useEffect(() => {
    // Only set interval if component is mounted
    let intervalId: NodeJS.Timeout | null = null;

    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % mainTexts.length);
    }, 3000); // Change every 3 seconds

    intervalId = interval;

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [mainTexts.length]);

  const handleSearch = () => {
    if (!query && !location) return;

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("location", location);

    router.push(`/jobs/search?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] flex items-center overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-center">
          {/* Main Content */}
          <div className="relative z-10 animate-fade-in">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-3xl lg:text-4xl font-extrabold text-white mb-2 leading-tight min-h-[60px] md:min-h-[70px] lg:min-h-[80px] flex items-center">
              <span
                key={`main-${currentText}`}
                className="inline-block animate-fade-in-up"
              >
                {mainTexts[currentText]}
              </span>
            </h1>
            <h2 className="text-5xl md:text-3xl lg:text-4xl font-extrabold mb-4 text-[var(--gold)] leading-tight min-h-[60px] md:min-h-[70px] lg:min-h-[80px] flex items-center relative">
              <span
                key={`sub-${currentText}`}
                className="inline-block animate-fade-in-up hover:text-[var(--gold-hover)] transition-colors duration-300 cursor-pointer"
                onClick={() => {
                  if (currentText === 0) {
                    router.push("/students");
                  } else {
                    router.push("/universities");
                  }
                }}
              >
                {subTexts[currentText]}
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-white mb-8 leading-relaxed">
              Bridging Education and Career Pathways Worldwide
            </p>

            {/* Student CTA */}
            <div className="mb-8">
              <Link href="/students">
                <Button variant="outline" className="px-6 py-2">
                  Explore Student Services →
                </Button>
              </Link>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-xl flex flex-col md:flex-row items-stretch mb-8 shadow-2xl border-2 border-[var(--gold)]/30 w-full overflow-hidden">
              <div className="flex-1 flex items-center gap-3 px-6 py-4 border-r border-[var(--gold)]/20">
                <svg
                  className="w-5 h-5 text-[var(--gold)] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="flex-1 outline-none border-0 text-[var(--blue-darkest)] placeholder:text-[var(--blue-medium)] bg-transparent text-base font-medium min-w-0 focus:ring-0 focus:outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="flex-1 flex items-center gap-3 px-6 py-4 border-r border-[var(--gold)]/20">
                <svg
                  className="w-5 h-5 text-[var(--gold)] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="City, state, or country"
                  className="flex-1 outline-none border-0 text-[var(--blue-darkest)] placeholder:text-[var(--blue-medium)] bg-transparent text-base font-medium min-w-0 focus:ring-0 focus:outline-none"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--blue-darkest)] font-semibold px-10 py-4 transition-all duration-300 text-base whitespace-nowrap self-stretch md:self-auto hover:shadow-lg"
              >
                Search
              </button>
            </div>

            {/* Key Features */}
            <div className="flex flex-wrap gap-4 md:gap-6 mb-8">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white text-base md:text-lg">
                  Visa Sponsorship
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white text-base md:text-lg">
                  Global Opportunities
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white text-base md:text-lg">
                  Expert Guidance
                </span>
              </div>
            </div>

            {/* Statistics */}
            <div className="flex flex-wrap gap-4 md:gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-5 py-4 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  500+
                </div>
                <div className="text-white/80 text-sm md:text-base">
                  Students Placed
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-5 py-4 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  15+
                </div>
                <div className="text-white/80 text-sm md:text-base">
                  Countries
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image on Right - Increased Width */}
          <div className="relative z-10 hidden lg:block animate-fade-in-delay hover:scale-[1.02] transition-transform duration-700">
            <div className="relative w-full max-w-lg mx-auto aspect-[3/4] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/hero.jpeg"
                alt="Graduates celebrating"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Icon */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
