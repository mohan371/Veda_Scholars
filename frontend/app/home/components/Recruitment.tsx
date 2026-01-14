  "use client";

  import Image from "next/image";
  import { useEffect, useRef, useState } from "react";
  import Badge from "../../components/Badge";
  import Button from "../../components/Button";
  import FeatureCard from "../../components/FeatureCard";

  export default function Recruitment() {
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
            {/* Left Side - Cards */}
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <Badge text="Services" />

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[var(--blue-old)]">
                Job placement service
              </h2>
              <p className="text-base md:text-lg text-[var(--blue-medium)] mb-8 leading-relaxed">
                We connect talent with professionals for suitable opportunities in
                India and overseas.
              </p>
              <div className="space-y-4 mb-8">
                <FeatureCard
                  icon={
                    <svg
                      className="w-6 h-6 text-[var(--gold)]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                  }
                  title="Employer Matching"
                  description="Connect with companies seeking your skills and expertise."
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
                        d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                      <path d="M3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  }
                  title="Career Growth"
                  description="Find roles that align with your professional aspirations."
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
                  title="International Placement"
                  description="Access global roles in various industries worldwide."
                />
              </div>
              <Button variant="primary">
                Explore Opportunities
              </Button>
            </div>

            {/* Right Side - Image */}
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/recruitment.jpg"
                  alt="Recruitment"
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
