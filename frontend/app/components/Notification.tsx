"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number; // Duration in milliseconds, default 5000
}

interface NotificationProps {
  notification: Notification;
  onClose: (id: string) => void;
}

/**
 * Notification Component
 * 
 * A reusable notification/toast component that displays success, error, warning, and info messages.
 * Automatically dismisses after the specified duration.
 * 
 * Usage:
 * ```tsx
 * <Notification notification={notification} onClose={handleClose} />
 * ```
 */
export default function Notification({ notification, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Trigger fade-in animation
    const rafId = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    let fadeOutTimer: NodeJS.Timeout | null = null;
    let removeTimer: NodeJS.Timeout | null = null;

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade-out animation before removing
      removeTimer = setTimeout(() => onClose(notification.id), 300);
    }, notification.duration || 5000);

    return () => {
      cancelAnimationFrame(rafId);
      if (timer) clearTimeout(timer);
      if (fadeOutTimer) clearTimeout(fadeOutTimer);
      if (removeTimer) clearTimeout(removeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification.id, notification.duration]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      onClose(notification.id);
      closeTimeoutRef.current = null;
    }, 300);
  }, [notification.id, onClose]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Icon and color configuration based on type
  const config = {
    success: {
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      iconColor: "text-green-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    warning: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    info: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const style = config[notification.type];

  return (
    <div
      className={`
        min-w-[300px] max-w-md
        ${style.bgColor} ${style.borderColor} border rounded-lg shadow-lg
        p-4 flex items-start gap-3
        transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}
      `}
    >
      {/* Icon */}
      <div className={`${style.iconColor} flex-shrink-0 mt-0.5`}>
        {style.icon}
      </div>

      {/* Message */}
      <div className="flex-1">
        <p className={`${style.textColor} text-sm font-medium`}>
          {notification.message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className={`
          ${style.textColor} hover:opacity-70
          flex-shrink-0 transition-opacity cursor-pointer
        `}
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

