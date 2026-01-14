"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Badge from "../../components/Badge";
import Button from "../../components/Button";

export default function Founder() {
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
          {/* Left Side - Text */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <Badge text="Meet the Founder" />
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[var(--blue-old)]">
              Harish J
            </h2>
            
            <p className="text-base md:text-lg text-[var(--blue-dark)] mb-8 leading-relaxed">
              Founder and CEO of Veda Scholars, Harish brings years of
              experience in education consultancy and recruitment. His vision is
              to bridge the gap between academic aspirations and career success,
              creating pathways for students and professionals to achieve their
              dreams globally.
            </p>
            
            {/* Statistics with Icons */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <svg
                    className="w-10 h-10 text-[var(--gold)]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-[var(--blue-old)] mb-1">
                  500+
                </div>
                <div className="text-sm text-[var(--blue-medium)]">Students Guided</div>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <svg
                    className="w-10 h-10 text-[var(--gold)]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-[var(--blue-old)] mb-1">
                  15+
                </div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <svg
                    className="w-10 h-10 text-[var(--gold)]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-[var(--blue-old)] mb-1">
                  10+
                </div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </div>
            
            <Button variant="secondary" className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Connect on LinkedIn
            </Button>
          </div>

          {/* Right Side - Image (1:1 aspect ratio) */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/founder.png"
                alt="Harish J"
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

