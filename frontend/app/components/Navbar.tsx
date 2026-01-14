"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { User, LogOut } from "lucide-react";

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const drawerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    // Custom event for immediate updates within the same window
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    // Clear any existing timeout
    if (drawerTimeoutRef.current) {
      clearTimeout(drawerTimeoutRef.current);
    }
    drawerTimeoutRef.current = setTimeout(() => {
      setIsDrawerVisible(false);
      drawerTimeoutRef.current = null;
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (drawerTimeoutRef.current) {
        clearTimeout(drawerTimeoutRef.current);
      }
    };
  }, []);

  const openDrawer = () => {
    setIsDrawerVisible(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsDrawerOpen(true);
      });
    });
  };

  const primaryLinks = [
    "About Us",
    "Careers",
    "Student Stories",
    "Events",
    "Universities Case Study",
  ];

  const secondaryLinks = [
    "Blogs",
    "Immigration Guide",
    "Career Ignition Hub",
    "Country Guides",
    "Campus Ambassador Programme",
    "FAQ & Support Center",
    "Get In Touch",
    "Partner With Us",
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 overflow-hidden py-2">
        <div className="absolute inset-0 bg-[var(--blue-darkest)] backdrop-blur-md"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex items-center h-16 w-full">
            {/* Logo */}
            <Link href="/" className="relative h-12 w-32 sm:h-14 sm:w-40 md:h-16 md:w-56 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Veda Scholars"
                fill
                className="object-contain object-left"
                priority
              />
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6 ml-auto flex-shrink-0">
              {/* Desktop Links */}
              <div className="hidden lg:flex items-center gap-6">
                <Link href="/universities" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
                  @Universities
                </Link>
                <Link href="/jobs/search" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
                  @Jobs
                </Link>
              </div>

              <div className="hidden lg:block h-6 w-px bg-white/20"></div>

              {/* Desktop Buttons */}
              <div className="hidden lg:flex items-center gap-4">
                <Button
                  variant="outline"
                  className="px-6 py-2 h-auto text-sm border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--blue-darkest)]"
                  href="/jobs/search"
                >
                  Find Jobs
                </Button>

                {isLoggedIn ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
                    >
                      <User size={18} />
                      <span className="text-sm font-medium">Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg text-white/70 hover:text-red-400 hover:bg-white/5 transition-colors"
                      title="Logout"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  // <Button variant="primary" className="px-6 py-2 h-auto text-sm" href="/auth/role-selection">
                  //   Login/Signup
                  // </Button>
                  null
                )}
              </div>

              <div className="h-6 w-px bg-white/20"></div>

              {/* Hamburger */}
              <button
                className="text-white cursor-pointer p-2"
                onClick={openDrawer}
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Drawer */}
      {isDrawerVisible && (
        <>
          <div
            className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
            onClick={closeDrawer}
          ></div>

          <div
            className={`fixed top-0 right-0 bottom-0 w-80 bg-white z-[70] shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex items-center justify-between p-6 border-b border-[var(--blue-medium-dark)]/20 sticky top-0 bg-white z-10">
              <div className="relative h-12 w-32">
                <Image src="/logo.png" alt="Veda Scholars" fill className="object-contain" />
              </div>
              <button className="text-[var(--blue-dark)] hover:text-[var(--blue-darkest)] p-2 -mr-2" onClick={closeDrawer}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="py-4">
              {primaryLinks.map((link, index) => {
                const getHref = (linkName: string) => {
                  if (linkName === "About Us") return "/about-us";
                  if (linkName === "Events") return "/events";
                  return "/under-development";
                };
                return (
                  <Link
                    key={index}
                    href={getHref(link)}
                    className="flex items-center justify-between px-6 py-4 text-[var(--blue-darkest)] hover:bg-[var(--blue-medium-dark)]/10 transition-colors group"
                    onClick={closeDrawer}
                  >
                    <span className="font-semibold text-base">{link}</span>
                    <svg className="w-5 h-5 text-[var(--blue-light)] group-hover:text-[var(--blue-medium-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}
            </div>

            <div className="py-4 border-t border-[var(--blue-medium-dark)]/20">
              {secondaryLinks.map((link, index) => (
                <Link
                  key={index}
                  href={
                    link === "Get In Touch"
                      ? "/get-in-touch"
                      : "/under-development"
                  }
                  className="block px-6 py-3 text-[var(--blue-medium)] hover:bg-[var(--blue-medium-dark)]/10 hover:text-[var(--blue-darkest)] transition-colors text-sm"
                  onClick={closeDrawer}
                >
                  {link}
                </Link>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-[var(--blue-medium-dark)]/20 space-y-3">
              <Button
                variant="outline"
                className="w-full justify-center"
                href="/jobs/search"
              >
                Find Jobs
              </Button>

              {isLoggedIn ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[var(--blue-darkest)] text-white rounded-lg hover:bg-[var(--blue-dark)] transition-colors"
                    onClick={closeDrawer}
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeDrawer();
                    }}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                // <Button variant="primary" className="w-full justify-center" href="/auth/role-selection">
                //   Login/Signup
                // </Button>
                null
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
