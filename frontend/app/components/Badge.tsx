"use client";

interface BadgeProps {
  text: string;
}

export default function Badge({ text }: BadgeProps) {
  return (
    <span className="inline-block px-4 py-2 bg-[var(--gold)] text-white text-sm font-semibold rounded-full mb-6 opacity-100">
      {text}
    </span>
  );
}
