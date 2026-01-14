"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Notification, { Notification as NotificationType } from "./Notification";

interface NotificationContextType {
  showNotification: (type: NotificationType["type"], message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * NotificationProvider
 * 
 * Provides a context for showing notifications throughout the application.
 * 
 * Usage:
 * ```tsx
 * // In your component
 * const { showNotification } = useNotification();
 * 
 * // Show notifications
 * showNotification("success", "Operation completed successfully!");
 * showNotification("error", "Something went wrong!");
 * showNotification("warning", "Please check your input.");
 * showNotification("info", "Here's some information.");
 * ```
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const showNotification = useCallback(
    (type: NotificationType["type"], message: string, duration?: number) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newNotification: NotificationType = {
        id,
        type,
        message,
        duration,
      };
      setNotifications((prev) => [...prev, newNotification]);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {/* Render all notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
          {notifications.map((notification) => (
            <div key={notification.id} className="pointer-events-auto">
              <Notification
                notification={notification}
                onClose={removeNotification}
              />
            </div>
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
}

/**
 * useNotification Hook
 * 
 * Hook to access the notification context.
 * 
 * @returns {NotificationContextType} Object with showNotification function
 * 
 * @example
 * ```tsx
 * const { showNotification } = useNotification();
 * showNotification("success", "Login successful!");
 * ```
 */
export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}

