"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FeatureCard from "../../components/FeatureCard";
import Badge from "../../components/Badge";

export default function EducationConsultancy() {
  const services = [
    {
      title: "Admission Procedures",
      description:
        "Comprehensive support through every step of the application process.",
      icon: (
        <svg
          className="w-6 h-6 text-[var(--gold)]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: "Program Matching",
      description:
        "Find the perfect fit for your academic goals and interests.",
      icon: (
        <svg
          className="w-6 h-6 text-[var(--gold)]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: "Visa Assistance",
      description: "Expert guidance for visa applications and documentation.",
      icon: (
        <svg
          className="w-6 h-6 text-[var(--gold)]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

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

  return (
    <section
      ref={sectionRef}
      className="min-h-screen py-20 px-4 bg-[var(--bg-light)] relative overflow-hidden flex items-center"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text and Cards */}
          <div
            className={`transition-all duration-1000 ${isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
              }`}
          >
            <Badge text="Services" />

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[var(--blue-old)]">
              Education Consultancy
            </h2>
            <p className="text-base md:text-lg text-[var(--blue-medium)] mb-8 leading-relaxed">
              We provide personalized guidance to students pursuing
              undergraduate or postgraduate degrees, helping them navigate
              admission processes for institutions worldwide and abroad.
            </p>
            <div className="space-y-4">
              {services.map((service, index) => {
                return (
                  <FeatureCard
                    key={index}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                  />
                );
              })}
            </div>
          </div>

          {/* Right Side - Image */}
          <div
            className={`transition-all duration-1000 ${isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
              }`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/education_consultancy.jpg"
                alt="Education Consultancy"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
