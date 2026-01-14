"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Badge from "../../components/Badge";

const testimonials = [
    {
        id: 1,
        name: "Karthik Krishnan",
        role: "M.Sc in Artificial Intelligence",
        university: "University of Sheffield",
        image: "https://picsum.photos/200/200?random=20",
        quote: "Veda Scholars made my dream of studying in the UK a reality. Their guidance on university selection and visa process was impeccable.",
    },
    {
        id: 2,
        name: "Princy",
        role: "MBA",
        university: "University of Leeds",
        image: "https://picsum.photos/200/200?random=21",
        quote: "The recruitment team helped me find a job that perfectly matches my skills. The transition from student to professional was seamless.",
    },
    {
        id: 3,
        name: "Sayed Jamil",
        role: "MSc Management of Information Systems",
        university: "University of Leeds",
        image: "https://picsum.photos/200/200?random=22",
        quote: "I was confused about my career path, but the counselors at Veda Scholars provided clarity and support at every step. Highly recommended!",
    },
];

export default function Testimonials() {
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
        <section
            ref={sectionRef}
            className="py-20 px-4 bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div
                        className={`flex justify-center mb-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                            }`}
                    >
                        <Badge text="Success Stories" />
                    </div>
                    <h2
                        className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                            }`}
                        style={{ transitionDelay: "100ms" }}
                    >
                        What Our Students Say
                    </h2>
                    <p
                        className={`text-lg text-white/80 max-w-2xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                            }`}
                        style={{ transitionDelay: "200ms" }}
                    >
                        Hear from students and professionals who have transformed their careers with Veda Scholars.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/10 transition-all duration-1000 hover:shadow-xl hover:-translate-y-2 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                                }`}
                            style={{ transitionDelay: `${300 + index * 100}ms` }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--gold)]">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">{testimonial.name}</h3>
                                    <p className="text-sm text-[var(--gold)] font-medium">{testimonial.role}</p>
                                    <p className="text-xs text-white/60">{testimonial.university}</p>
                                </div>
                            </div>
                            <div className="relative">
                                <svg
                                    className="absolute -top-2 -left-2 w-8 h-8 text-white/10 transform -scale-x-100"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                                </svg>
                                <p className="text-white/80 italic relative z-10 pl-6">
                                    "{testimonial.quote}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
