"use client";

import { useEffect, useRef, useState } from "react";
import Badge from "../../components/Badge";

export default function USP() {
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
      className="py-20 px-4 min-h-screen relative bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] flex items-center justify-center"
      id="usp"
    >
      <div className="max-w-7xl mx-auto text-center w-full">
        <div
          className={`transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex justify-center mb-6">
            <Badge text="What Makes Us Different" />
          </div>
        </div>
        
        <h2
          className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary-foreground transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          Our Unique Value Offered
        </h2>
        
        <p
          className={`text-base md:text-lg text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed mb-12 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          The synergy of education consultancy and recruitment within a single
          platform sets Veda Scholars apart. We guide students toward their
          ideal academic path and support them in transitioning seamlessly into
          the professional world.
        </p>

        {/* Education and Employment Icons */}
        <div
          className={`flex items-center justify-center gap-8 md:gap-16 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {/* Education Icon */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-[var(--gold)] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[var(--gold)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14v9M5 13.909A11.94 11.94 0 0112 13c4.97 0 9.418 2.692 11.1 6.109"
                />
              </svg>
            </div>
            <span className="text-primary-foreground text-lg font-semibold">Education</span>
          </div>

          {/* Connecting Line */}
          <div className="h-0.5 w-16 md:w-24 bg-[var(--gold)]"></div>

          {/* Employment Icon */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-[var(--gold)] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[var(--gold)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-primary-foreground text-lg font-semibold">Employment</span>
          </div>
        </div>
      </div>
    </section>
  );
}

