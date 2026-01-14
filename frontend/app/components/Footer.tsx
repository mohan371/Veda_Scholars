"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Button from "./Button";
import Link from "next/link";

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;
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

  return (
    <>
      {/* CTA Section */}
      <section
        ref={sectionRef}
        className="bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] text-primary-foreground py-20 px-4 relative overflow-hidden flex items-center justify-center"
      >
        <div className="max-w-7xl mx-auto text-center w-full">
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 text-primary-foreground transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            From Education to Employment
          </h2>
          <p
            className={`text-2xl md:text-3xl text-primary-foreground/90 mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            style={{ transitionDelay: "100ms" }}
          >
            Your Journey, Our Guidance
          </p>

          {/* Call-to-Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            style={{ transitionDelay: "200ms" }}
          >
            <Button variant="primary" href="/get-in-touch" className="w-full sm:w-auto sm:min-w-[200px] px-8 py-3 h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold border-none">
              Book Your Free Counselling Today!
            </Button>
            <Button variant="outline" href="/under-development" className="w-full sm:w-auto sm:min-w-[200px] px-8 py-3 h-12 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
              Join as a Partner
            </Button>
          </div>
        </div>
      </section>

      {/* Main Footer Content */}
      <footer className="bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] text-white pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Column 1: Brand & Contact */}
            <div className="space-y-6">
              <div className="relative h-24 w-48">
                <Image
                  src="/logo.png"
                  alt="Veda Scholars"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold tracking-wider mb-2 uppercase text-white/60">CONTACT US</h3>
                <a href="mailto:info@vedascholars.com" className="text-white/80 hover:text-white transition-colors block mb-2">
                  info@vedascholars.com
                </a>
                <a href="https://www.vedascholars.com" className="text-white/80 hover:text-white transition-colors block mb-2">
                  www.vedascholars.com
                </a>
                <div className="text-white/80 text-sm space-y-1">
                  <div>+91 7708722334</div>
                  <div>+44 7796271532</div>
                  <div>+971 559196409</div>
                </div>
                <div className="text-white/60 text-xs mt-2">
                  India | UK | UAE
                </div>
              </div>

              <div className="flex gap-4">
                {/* Social Icons */}
                <Link href="/under-development" className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </Link>
                <Link href="/under-development" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" /></svg>
                </Link>
                <Link href="/under-development" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                </Link>
                <Link href="/under-development" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.53c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.825-.059.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.825-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </Link>
              </div>
            </div>

            {/* Column 2: Company */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider mb-6 uppercase text-white/60">COMPANY</h3>
              <ul className="space-y-4">
                <li><Link href="/about-us" className="text-white/80 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/under-development" className="text-white/80 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/under-development" className="text-white/80 hover:text-white transition-colors">Student Stories</Link></li>
                <li><Link href="/under-development" className="text-white/80 hover:text-white transition-colors">University Case Study</Link></li>
                <li><Link href="/under-development" className="text-white/80 hover:text-white transition-colors">Blogs</Link></li>
                <li><Link href="/under-development" className="text-white/80 hover:text-white transition-colors">Campus Ambassador Programme</Link></li>
              </ul>
            </div>

            {/* Column 3: Solutions */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider mb-6 uppercase text-white/60">SOLUTIONS</h3>
              <ul className="space-y-4">
                <li><Link href="/under-development" className="text-white/80 hover:text-white transition-colors">Immigration Guide</Link></li>
                <li><Link href="/under-development" className="text-white/80 hover:text-white transition-colors">Country Guides</Link></li>
                <li><Link href="/under-development" className="text-white/80 hover:text-white transition-colors">Workshops and Webinars</Link></li>
                <li><Link href="/under-development" className="text-white/80 hover:text-white transition-colors">Employer Handbook</Link></li>
              </ul>
            </div>

            {/* Column 4: Connect and Support */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider mb-6 uppercase text-white/60">CONNECT AND SUPPORT</h3>
              <ul className="space-y-4">
                <li><Link href="/under-development" className="text-white/80 hover:text-white transition-colors">FAQ & Support Center</Link></li>
                <li><Link href="/get-in-touch" className="text-white/80 hover:text-white transition-colors">Get In Touch</Link></li>
                <li><Link href="/under-development" className="text-white/80 hover:text-white transition-colors">Partner With Us</Link></li>
                <li><Link href="/under-development" className="text-white/80 hover:text-white transition-colors">Recruit Talent</Link></li>
              </ul>
            </div>
          </div>

          {/* Location Section */}
          <div className="border-t border-[var(--blue-medium-dark)] pt-8 mt-8">
            <h3 className="text-sm font-semibold tracking-wider mb-4 uppercase text-white/60">Location</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
              <span>India</span>
              <span>|</span>
              <span>UK</span>
              <span>|</span>
              <span>UAE</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-[var(--blue-medium-dark)] pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
            <p>© 2025 Veda Scholars. Empowering futures, one step at a time.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/under-development" className="hover:text-white">Privacy Policy</Link>
              <Link href="/under-development" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
