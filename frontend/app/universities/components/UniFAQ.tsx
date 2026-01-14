"use client";

import { useState } from "react";
import Badge from "../../components/Badge";

const faqs = [
    {
        question: "Are you able to do campus events and workshops?",
        answer: "Yes, we are happy to have an on-campus presence with career fair stands, webinars and workshops. Depending on the size and degree, we can customise the workshop as well. Reach out to your Veda Scholars representative contact.",
    },
    {
        question: "Do our students get other career services in addition to the job portal?",
        answer: "Yes, we organise timely webinars, career workshops and other training sessions for university career teams. You can check more on our webinars page.",
    },
    {
        question: "Can I access students’ activity reports on my dashboard?",
        answer: "Yes, you can check students’ usage reports on your dashboard. We provide different reports like new sign-ups, the number of jobs applied, among other student engagement metrics.",
    },
    {
        question: "Are you GDPR compliant?",
        answer: "Yes, we are fully GDPR compliant and take data privacy very seriously.",
    },
    {
        question: "How do I schedule a demo for Veda Scholars?",
        answer: "You can fill out the university demo request form on our contact page. Our team will reach out to you with complete information about our services and schedule a demo.",
    },
    {
        question: "Why should our university partner with Veda Scholars?",
        answer: "On Veda Scholars, we only advertise vacancies that are appropriate for international students at your university. This includes Skilled Worker Visa-eligible jobs, placements, and internships. It allows the students to browse all the jobs/internships provided by the Skilled Worker Route employers.",
    },
];

export default function UniFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-[var(--bg-light)]">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-4">
                        <Badge text="Common Questions" />
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--blue-darkest)] mb-6">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className="font-bold text-[var(--blue-darkest)] text-sm md:text-base pr-8">
                                    {faq.question}
                                </span>
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition-transform duration-300 ${openIndex === index ? "rotate-180 bg-[var(--gold)] text-white" : "text-gray-400"}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="p-6 pt-0 text-sm md:text-base text-gray-600 leading-relaxed border-t border-gray-50 mt-2">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
