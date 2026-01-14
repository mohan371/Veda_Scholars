"use client";

import { useEffect, useRef, useState } from "react";

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export default function ParallaxSection({
  children,
  speed = 0.5,
  className = "",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [parallax, setParallax] = useState(0);
  const rafId = useRef<number | null>(null);
  const ticking = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
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

  // Only set up scroll listener when visible to save CPU
  useEffect(() => {
    isMountedRef.current = true;
    
    if (!isVisible) {
      setParallax(0);
      return;
    }

    const handleScroll = () => {
      if (!ticking.current && isMountedRef.current) {
        ticking.current = true;
        rafId.current = requestAnimationFrame(() => {
          // Only update state if component is still mounted
          if (isMountedRef.current) {
            setParallax(window.scrollY * speed);
          }
          ticking.current = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      isMountedRef.current = false;
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
      ticking.current = false;
    };
  }, [isVisible, speed]);
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{
        transform: isVisible ? `translateY(${parallax}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
}

