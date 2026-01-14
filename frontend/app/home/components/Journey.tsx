"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FeatureCard from "../../components/FeatureCard";
import Badge from "../../components/Badge";
import Button from "../../components/Button";

export default function Journey() {
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
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Side - Text */}
          <div
            className={`transition-all duration-1000 ${isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
              }`}
          >
            <Badge text="About Us" />

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[var(--blue-old)]">
              Your Journey Begins Here
            </h2>

            <p className="text-base md:text-lg text-[var(--blue-dark)] mb-8 leading-relaxed">
              Veda Scholars is a dynamic platform that integrates education
              consultancy and recruitment services. Our mission is to empower
              individuals to make informed academic and career choices, ensuring
              their aspirations are matched with the right opportunities.
            </p>
            
            <Button 
              variant="outline" 
              href="/about-us"
              className="bg-white border-2 border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Learn more about us
            </Button>
          </div>

          {/* Right Side - Image and Cards */}
          <div
            className={`transition-all duration-1000 ${isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
              }`}
            style={{ transitionDelay: "100ms" }}
          >
            {/* Image */}
            <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-lg mb-6">
              <Image
                src="/Journey.jpg"
                alt="Students collaborating"
                width={800}
                height={600}
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Cards */}
            <div className="space-y-4">
              <FeatureCard
                icon={
                  <svg
                    className="w-6 h-6 text-[var(--gold)]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                }
                title="Student Success"
                description="Start your academic journey with personalized guidance"
              />

              <FeatureCard
                icon={
                  <svg
                    className="w-6 h-6 text-[var(--gold)]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                title="Global Opportunities"
                description="Access education and career prospects worldwide"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

