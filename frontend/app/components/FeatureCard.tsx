"use client";

import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative bg-white rounded-lg p-8 shadow-md border-2 border-gray-300 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-[var(--gold)] overflow-hidden">
      {/* Gold light flash animation overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent w-[150%] h-full shimmer-overlay"></div>
      </div>
      
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-[var(--gold)]/10 flex items-center justify-center border border-[var(--gold)]/30">
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 text-[var(--blue-old)] group-hover:text-[var(--gold)] transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

