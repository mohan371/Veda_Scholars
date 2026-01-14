"use client";

import { useEffect, useState, useRef } from "react";

export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);
  const rafId = useRef<number | null>(null);
  const ticking = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    const handleScroll = () => {
      // Use requestAnimationFrame to throttle updates
      if (!ticking.current && isMountedRef.current) {
        ticking.current = true;
        rafId.current = requestAnimationFrame(() => {
          // Only update state if component is still mounted
          if (isMountedRef.current) {
            setOffset(window.scrollY * speed);
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
    };
  }, [speed]);

  return offset;
}

export function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("scroll-animate");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, []);

  return isVisible;
}

