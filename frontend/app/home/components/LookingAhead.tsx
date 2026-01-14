"use client";

import { useEffect, useRef, useState } from "react";
import Badge from "../../components/Badge";

export default function LookingAhead() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, []);

  const visionCards = [
    {
      icon: (
        <svg
          className="w-8 h-8 text-[var(--gold)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" strokeWidth="2" />
        </svg>
      ),
      title: "Personalized Guidance",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-[var(--gold)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      title: "Transparent Processes",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-[var(--gold)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Sustainable Partnerships",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="min-h-screen py-20 px-4 bg-[var(--bg-light)] relative overflow-hidden flex items-center"
    >
      <div className="max-w-7xl mx-auto text-center w-full">
        {/* Eye Icon */}
        <div
          className={`flex justify-center mb-4 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-[var(--gold)] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[var(--bg-light)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
        </div>

        {/* Our Vision Badge */}
        <div
          className={`flex justify-center mb-6 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <Badge text="Our Vision" />
        </div>

        {/* Heading */}
        <h2
          className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[var(--blue-old)] transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          Looking Ahead
        </h2>

        {/* Description */}
        <p
          className={`text-base md:text-lg text-[var(--blue-medium)] leading-relaxed max-w-4xl mx-auto mb-12 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          To become a globally recognized platform that empowers students and
          professionals to achieve their academic and career aspirations through
          personalized guidance, transparent processes, and sustainable
          partnerships.
        </p>

        {/* Vision Cards */}
        <div
          className={`grid md:grid-cols-3 gap-6 max-w-5xl mx-auto transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          {visionCards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-lg p-8 shadow-md border-2 border-[var(--blue-medium-dark)]/30 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-[var(--gold)] overflow-hidden"
            >
              {/* Gold light flash animation overlay */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent w-[150%] h-full shimmer-overlay"></div>
              </div>
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[var(--gold)]/10 flex items-center justify-center mb-4 border border-[var(--gold)]/30">
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-[var(--blue-old)] group-hover:text-[var(--gold)] transition-colors duration-300">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

