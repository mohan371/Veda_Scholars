'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Button from '../ui/Button';
import { Menu, X } from 'lucide-react';

export default function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Students', href: '/students' },
        { name: 'Universities', href: '/universities' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    {/* Brand Identity Block */}
                    <Link href="/" className="flex items-center gap-3 z-50 group">
                        {/* Logo Icon */}
                        <div className="relative h-10 w-10 md:h-11 md:w-11 rounded-lg overflow-hidden shadow-sm transition-transform duration-300 ease-in-out group-hover:scale-105">
                            <Image
                                src="/images/veda-logo.png"
                                alt="Veda Scholars Logo"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Brand Text */}
                        <div className="flex flex-col justify-center">
                            <span className={`font-heading font-bold text-xl md:text-2xl tracking-tight leading-none transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                                Veda Scholars
                            </span>
                            <span className={`text-[0.65rem] md:text-[0.7rem] font-medium tracking-[0.2em] uppercase mt-1 transition-colors duration-300 ${isScrolled ? 'text-[#B8860B]' : 'text-[#B8860B]'}`}>
                                Learn • Lead • Inspire
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative text-sm font-medium transition-colors duration-300 group/nav
                                        ${isActive ? 'text-[#B8860B]' : isScrolled ? 'text-slate-700 hover:text-[#B8860B]' : 'text-slate-800 hover:text-[#B8860B]'}
                                    `}
                                >
                                    {link.name}
                                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#B8860B] transform origin-left transition-transform duration-300 ease-out
                                        ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'}
                                    `} />
                                </Link>
                            );
                        })}
                        <Button
                            id="btn-nav-cta"
                            variant="primary"
                            size="sm"
                            href="/contact"
                            className="bg-[#B8860B] hover:bg-[#9a7009] text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Get Started
                        </Button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden z-50 p-2 text-primary focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="w-6 flex flex-col items-end gap-1.5">
                            <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </div>
                    </button>

                    {/* Mobile Navigation Overlay */}
                    <div
                        className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                            }`}
                    >
                        <nav className="flex flex-col items-center gap-8 text-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="font-heading text-2xl font-bold text-slate-800 hover:text-primary transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="mt-4">
                                <Button
                                    id="btn-mobile-nav-cta"
                                    variant="primary"
                                    size="lg"
                                    href="/contact"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="bg-[#B8860B] hover:bg-[#9a7009] text-white rounded-lg shadow-md hover:shadow-lg"
                                >
                                    Get Started
                                </Button>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}

