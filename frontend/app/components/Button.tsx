"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  onClick?: React.MouseEventHandler;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  href?: string;
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  disabled = false,
  href,
}: ButtonProps) {
  const baseClasses =
    "px-8 py-3 font-semibold rounded-lg transition-all duration-300 ease-out box-border disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md inline-flex items-center justify-center";

  const variantClasses = {
    primary: "bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--blue-darkest)]",
    secondary: "bg-[var(--blue-medium-dark)] hover:bg-[var(--blue-dark)] text-white",
    outline:
      "bg-transparent border-2 border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--blue-darkest)] hover:border-[var(--gold-hover)]",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
