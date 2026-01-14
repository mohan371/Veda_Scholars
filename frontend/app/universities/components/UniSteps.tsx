"use client";

import { useEffect, useRef, useState } from "react";
import Badge from "../../components/Badge";

const steps = [
    {
        number: "01",
        title: "Partner With Us",
        description: "Sign up as a university partner and get access to our dedicated employer network.",
    },
    {
        number: "02",
        title: "Integrate Dashboard",
        description: "We set up a branded dashboard for your students to access jobs and resources.",
    },
    {
        number: "03",
        title: "Empower Students",
        description: "Your international students get hired by top companies sponsoring visas.",
    },
];

export default function UniSteps() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
            observer.disconnect();
        };
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-20">
                    <div className={`flex justify-center mb-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <Badge text="How It Works" />
                    </div>
                    <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--blue-darkest)] mb-6 transition-all duration-1000 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        Simple 3-Step Process
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>

                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`relative bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                            style={{ transitionDelay: `${200 + index * 200}ms` }}
                        >
                            <div className="w-24 h-24 bg-[var(--blue-darkest)] rounded-full flex items-center justify-center text-3xl font-bold text-[var(--gold)] mb-8 mx-auto border-4 border-white shadow-lg">
                                {step.number}
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-[var(--blue-darkest)] mb-4 text-center">{step.title}</h3>
                            <p className="text-sm md:text-base text-gray-600 text-center leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
