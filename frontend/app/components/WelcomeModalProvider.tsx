"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import WelcomeModal from "./WelcomeModal";

export default function WelcomeModalProvider() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Don't show modal on admin pages
    if (pathname?.startsWith("/admin")) {
      return;
    }

    // Check if user has already submitted the modal in this browser session
    // Using sessionStorage so it resets on each new browser session/tab
    const hasSubmittedInSession = sessionStorage.getItem("welcomeModalSubmitted");

    // Only skip if user has already submitted in this session (to avoid spamming within same session)
    // But show on every fresh page load/refresh in a new session
    if (hasSubmittedInSession) {
      return;
    }

    // Set timer for 10 seconds - this will run on every page load/refresh
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [pathname]); // Re-run when pathname changes (page navigation/refresh)

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return <WelcomeModal isOpen={isModalOpen} onClose={handleClose} />;
}

