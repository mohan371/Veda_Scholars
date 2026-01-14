"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Star,
  GraduationCap,
  Globe,
  Rocket,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

const quotes = [
  {
    text: "Education is the passport to the future...",
    color: "text-blue-400",
    icon: GraduationCap,
  },
  {
    text: "Connecting talent with global opportunities...",
    color: "text-emerald-400",
    icon: Globe,
  },
  {
    text: "Launching your career beyond borders...",
    color: "text-orange-400",
    icon: Rocket,
  },
  {
    text: "Knowledge has no boundaries...",
    color: "text-yellow-400",
    icon: Lightbulb,
  },
  {
    text: "Aspire today, Lead tomorrow...",
    color: "text-pink-400",
    icon: Sparkles,
  },
];

const MIN_LOAD_TIME = 3000; // 3 seconds minimum

const VedasLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const pathname = usePathname();
  const [startTime, setStartTime] = useState(() => Date.now());

  // Reset loader on route change (only if pathname actually changed)
  const prevPathname = useRef(pathname);
  useEffect(() => {
    // Only reset if pathname actually changed
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      // Use setTimeout to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        setIsLoading(true);
        setShouldRender(true);
        setStartTime(Date.now());
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    // Always show loader for at least MIN_LOAD_TIME
    let minLoadTimer: NodeJS.Timeout | null = null;

    // Calculate elapsed time since startTime
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);

    minLoadTimer = setTimeout(() => {
      setIsLoading(false);
    }, remaining);

    return () => {
      if (minLoadTimer) {
        clearTimeout(minLoadTimer);
      }
    };
  }, [startTime]);

  // Rotate quotes
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
      }, 3000); // 3 seconds per quote - enough time to read
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  // Handle unmounting after animation finishes
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500); // Match transition duration (0.5s)
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <>
      <div className={`preloader ${!isLoading ? "loader-hidden" : ""}`}>
        <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
          {/* Logo Section */}
          <div className="text-center mb-12 relative z-10 w-full flex flex-col items-center">
            <div className="relative w-64 h-20 mb-6 animate-fade-in-up">
              <Image
                src="/logo.png"
                alt="Veda Scholars"
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="loader-subtitle text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-yellow-200 font-bold tracking-[0.5em] text-center">
              Learn. Lead. Inspire.
            </p>
          </div>

          {/* Animation Section */}
          <div className="ladder-scene mb-12">
            {/* Steps */}
            <div className="step step-1"></div>
            <div className="step step-2"></div>
            <div className="step step-3"></div>

            {/* Climber */}
            <div className="climber-wrapper">
              <div className="climber-body"></div>
            </div>

            {/* Goal */}
            <div className="goal-star">
              <Star className="w-8 h-8 fill-current" />
            </div>
            <div className="star-burst"></div>
          </div>

          {/* Quotes Section */}
          <div className="h-8 flex items-center justify-center gap-2">
            {React.createElement(quotes[quoteIndex].icon, {
              className: `w-5 h-5 ${quotes[quoteIndex].color} animate-pulse`,
            })}
            <p
              className={`text-lg font-medium tracking-wider animate-pulse text-center transition-all duration-500 drop-shadow-sm ${quotes[quoteIndex].color}`}
            >
              {quotes[quoteIndex].text}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* === LOADER STYLES === */
        .preloader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom right,
            #030625,
            #050939,
            #0a0f4d
          );
          z-index: 99999;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          transition: opacity 0.5s ease-out, visibility 0.5s;
        }

        .loader-hidden {
          opacity: 0;
          visibility: hidden;
        }

        .ladder-scene {
          position: relative;
          width: 120px;
          height: 160px;
        }

        .step {
          position: absolute;
          width: 40px;
          height: 6px;
          background: linear-gradient(90deg, #d4af37, #fcd34d);
          border-radius: 4px;
          box-shadow: 0 4px 10px rgba(212, 175, 55, 0.2);
        }
        .step-1 {
          bottom: 20px;
          left: 0px;
          animation: glowStep 1.2s infinite 0s;
        }
        .step-2 {
          bottom: 60px;
          left: 40px;
          animation: glowStep 1.2s infinite 0.3s;
        }
        .step-3 {
          bottom: 100px;
          left: 80px;
          animation: glowStep 1.2s infinite 0.6s;
        }

        .climber-wrapper {
          position: absolute;
          width: 20px;
          height: 20px;
          bottom: 26px;
          left: 10px;
          animation: climbSequence 1.2s infinite
            cubic-bezier(0.6, -0.28, 0.735, 0.045);
        }

        .climber-body {
          width: 100%;
          height: 100%;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
          animation: squashStretch 1.2s infinite ease-in-out;
        }

        .goal-star {
          position: absolute;
          top: 0;
          right: 0;
          color: #fbbf24;
          filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.5));
          animation: starPulse 1.2s infinite ease-in-out;
        }

        .star-burst {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid #fff;
          opacity: 0;
          transform: translate(50%, -50%) scale(0);
          animation: burst 1.2s infinite;
        }

        .loader-subtitle {
          font-family: sans-serif;
          font-size: 0.85rem;
          margin-top: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          animation: pulseText 1.5s infinite ease-in-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        /* === KEYFRAMES === */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glowStep {
          0%,
          100% {
            filter: brightness(1);
            box-shadow: 0 4px 10px rgba(212, 175, 55, 0.2);
          }
          50% {
            filter: brightness(1.3);
            box-shadow: 0 4px 20px rgba(212, 175, 55, 0.6);
          }
        }

        @keyframes climbSequence {
          0% {
            bottom: 26px;
            left: 10px;
          }
          10% {
            bottom: 26px;
            left: 10px;
          }
          25% {
            bottom: 85px;
            left: 30px;
          }
          35% {
            bottom: 66px;
            left: 50px;
          }
          45% {
            bottom: 66px;
            left: 50px;
          }
          60% {
            bottom: 125px;
            left: 70px;
          }
          70% {
            bottom: 106px;
            left: 90px;
          }
          80% {
            bottom: 106px;
            left: 90px;
          }
          90% {
            bottom: 145px;
            left: 100px;
            opacity: 1;
          }
          95% {
            bottom: 145px;
            left: 100px;
            opacity: 0;
            transform: scale(2);
          }
          100% {
            bottom: 26px;
            left: 10px;
            opacity: 0;
          }
        }

        @keyframes squashStretch {
          0%,
          10%,
          35%,
          45%,
          70%,
          80% {
            transform: scale(1.3, 0.7);
          }
          5%,
          25%,
          40%,
          60%,
          75% {
            transform: scale(0.8, 1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes starPulse {
          0%,
          85% {
            transform: scale(1);
          }
          92% {
            transform: scale(1.4) rotate(20deg);
            color: #fff;
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes burst {
          0%,
          90% {
            opacity: 0;
            transform: translate(50%, -50%) scale(0);
          }
          92% {
            opacity: 1;
            transform: translate(50%, -50%) scale(0.5);
            border-width: 4px;
          }
          100% {
            opacity: 0;
            transform: translate(50%, -50%) scale(2);
            border-width: 0px;
          }
        }

        @keyframes pulseText {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default VedasLoader;
