"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowLeft, Users, Mail } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/Button";

// Mock events data - replace with actual data from API
const eventsData: Record<string, {
    id: string;
    title: string;
    description: string;
    fullDescription: string;
    date: string;
    time: string;
    location: string;
    image: string;
    category: string;
    speakers?: string[];
    agenda?: string[];
    registrationLink?: string;
}> = {
    "study-abroad-fair-2025": {
        id: "study-abroad-fair-2025",
        title: "Study Abroad Fair 2025",
        description: "Join us for our annual study abroad fair featuring top universities from around the world.",
        fullDescription: "Join us for our annual Study Abroad Fair 2025, the premier event for students seeking international education opportunities. This comprehensive fair brings together leading universities from the UK, USA, Canada, Australia, and Europe under one roof. Meet admissions officers face-to-face, explore scholarship opportunities, attend informative sessions, and get personalized guidance from our expert counselors. Whether you're looking for undergraduate or postgraduate programs, this event is your gateway to global education.",
        date: "March 15, 2025",
        time: "10:00 AM - 4:00 PM",
        location: "London, UK",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop",
        category: "Education",
        speakers: [
            "Dr. Sarah Johnson - University Admissions Expert",
            "Prof. Michael Chen - International Education Advisor",
            "Emma Williams - Scholarship Specialist"
        ],
        agenda: [
            "10:00 AM - Opening Ceremony",
            "10:30 AM - University Presentations",
            "12:00 PM - Scholarship Information Session",
            "1:00 PM - Lunch Break",
            "2:00 PM - One-on-One Counseling Sessions",
            "3:30 PM - Visa Guidance Workshop",
            "4:00 PM - Networking & Closing"
        ],
        registrationLink: "/get-in-touch"
    },
    "career-workshop-series": {
        id: "career-workshop-series",
        title: "Career Workshop Series",
        description: "Enhance your career prospects with our comprehensive workshop series.",
        fullDescription: "Our Career Workshop Series is designed to equip you with essential skills and knowledge to excel in today's competitive job market. Over the course of this intensive workshop, you'll learn proven strategies for resume building, master interview techniques, develop networking skills, and discover effective job search methods. Our expert facilitators will provide personalized feedback and actionable insights to help you stand out to employers.",
        date: "April 20, 2025",
        time: "2:00 PM - 5:00 PM",
        location: "Online",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=800&fit=crop",
        category: "Career",
        speakers: [
            "James Anderson - Career Coach",
            "Lisa Martinez - HR Professional",
            "David Kim - LinkedIn Expert"
        ],
        agenda: [
            "2:00 PM - Welcome & Introduction",
            "2:15 PM - Resume Building Workshop",
            "3:00 PM - Interview Skills Masterclass",
            "3:45 PM - Networking Strategies",
            "4:30 PM - Q&A Session",
            "5:00 PM - Closing"
        ],
        registrationLink: "/get-in-touch"
    },
    "university-partnership-summit": {
        id: "university-partnership-summit",
        title: "University Partnership Summit",
        description: "A networking event for universities and educational institutions.",
        fullDescription: "The University Partnership Summit brings together educational institutions, recruitment agencies, and industry leaders to explore collaborative opportunities. This exclusive event provides a platform for universities to showcase their programs, discuss student recruitment strategies, share best practices, and establish meaningful partnerships. Join us for insightful panel discussions, networking sessions, and partnership opportunities.",
        date: "May 10, 2025",
        time: "9:00 AM - 6:00 PM",
        location: "Dubai, UAE",
        image: "https://images.unsplash.com/photo-1503676260721-4d00c4ef78ba?w=1200&h=800&fit=crop",
        category: "Partnership",
        speakers: [
            "Dr. Robert Taylor - International Education Director",
            "Maria Garcia - Partnership Development Manager",
            "Dr. Ahmed Hassan - University Relations Expert"
        ],
        agenda: [
            "9:00 AM - Registration & Networking Breakfast",
            "10:00 AM - Opening Keynote",
            "11:00 AM - Panel Discussion: Student Recruitment Trends",
            "12:30 PM - Lunch & Networking",
            "2:00 PM - Partnership Opportunities Session",
            "4:00 PM - Best Practices Workshop",
            "5:30 PM - Closing Remarks & Cocktail Reception"
        ],
        registrationLink: "/get-in-touch"
    },
    "scholarship-information-session": {
        id: "scholarship-information-session",
        title: "Scholarship Information Session",
        description: "Learn about available scholarships and financial aid opportunities.",
        fullDescription: "Discover a world of scholarship opportunities at our comprehensive information session. Learn about merit-based scholarships, need-based financial aid, country-specific programs, and university-specific awards. Our financial aid experts will guide you through eligibility criteria, application processes, deadlines, and tips for writing compelling scholarship essays. This session is essential for students planning to study abroad.",
        date: "June 5, 2025",
        time: "3:00 PM - 5:00 PM",
        location: "Online",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop",
        category: "Education",
        speakers: [
            "Jennifer Lee - Scholarship Advisor",
            "Dr. Mark Thompson - Financial Aid Specialist",
            "Sophie Brown - Application Review Expert"
        ],
        agenda: [
            "3:00 PM - Introduction to Scholarships",
            "3:20 PM - Types of Scholarships Available",
            "3:45 PM - Application Process & Requirements",
            "4:15 PM - Essay Writing Tips",
            "4:45 PM - Q&A Session",
            "5:00 PM - Closing"
        ],
        registrationLink: "/get-in-touch"
    },
    "alumni-success-stories": {
        id: "alumni-success-stories",
        title: "Alumni Success Stories Event",
        description: "Hear inspiring stories from our successful alumni.",
        fullDescription: "Join us for an evening of inspiration and networking as we celebrate the achievements of our alumni. Hear firsthand accounts of their journeys from students to successful professionals across various industries. Learn about their challenges, triumphs, and the role Veda Scholars played in their success. This event provides an excellent opportunity to network with professionals and gain insights into different career paths.",
        date: "July 18, 2025",
        time: "6:00 PM - 8:00 PM",
        location: "Mumbai, India",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop",
        category: "Networking",
        speakers: [
            "Rajesh Kumar - Software Engineer at Google",
            "Priya Sharma - Marketing Director at Microsoft",
            "Amit Patel - Entrepreneur & Startup Founder"
        ],
        agenda: [
            "6:00 PM - Welcome & Networking",
            "6:30 PM - Alumni Success Stories Panel",
            "7:15 PM - Q&A Session",
            "7:45 PM - Networking & Refreshments",
            "8:00 PM - Closing"
        ],
        registrationLink: "/get-in-touch"
    },
    "visa-guidance-workshop": {
        id: "visa-guidance-workshop",
        title: "Visa Guidance Workshop",
        description: "Comprehensive workshop on visa requirements and application processes.",
        fullDescription: "Navigate the complex world of student visas with confidence at our comprehensive Visa Guidance Workshop. Our immigration experts will cover visa requirements for major study destinations including the UK, USA, Canada, and Australia. Learn about required documentation, application timelines, interview preparation, common mistakes to avoid, and tips for a successful visa application. Get your questions answered by experienced immigration consultants.",
        date: "August 12, 2025",
        time: "11:00 AM - 2:00 PM",
        location: "Online",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800&fit=crop",
        category: "Education",
        speakers: [
            "Immigration Lawyer Sarah Johnson",
            "Visa Consultant Michael Brown",
            "Documentation Expert Emily Davis"
        ],
        agenda: [
            "11:00 AM - Introduction to Student Visas",
            "11:30 AM - UK Visa Requirements",
            "12:00 PM - USA Visa Process",
            "12:30 PM - Canada & Australia Visas",
            "1:00 PM - Documentation Checklist",
            "1:30 PM - Interview Preparation",
            "2:00 PM - Q&A & Closing"
        ],
        registrationLink: "/get-in-touch"
    },
};

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;
    const event = eventsData[eventId];

    if (!event) {
        return (
            <main className="min-h-screen">
                <Navbar />
                <div className="bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] min-h-screen text-white flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
                        <p className="text-white/80 mb-8">The event you're looking for doesn't exist.</p>
                        <Button variant="primary" href="/events">
                            Back to Events
                        </Button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] min-h-screen text-white selection:bg-[var(--gold)] selection:text-[var(--blue-darkest)]">
                {/* Background Gradients */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[var(--blue-medium-dark)]/10 rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[var(--gold)]/5 rounded-full blur-[150px]"></div>
                </div>

                {/* Hero Image Section */}
                <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 z-10">
                    <div className="max-w-7xl mx-auto px-4 lg:px-8">
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Events</span>
                        </Link>

                        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--blue-darkest)] via-[var(--blue-darkest)]/50 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <div className="mb-4">
                                    <span className="px-4 py-2 rounded-full bg-[var(--gold)]/90 text-[var(--blue-darkest)] text-sm font-semibold backdrop-blur-sm">
                                        {event.category}
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                    {event.title}
                                </h1>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Event Details Section */}
                <section className="relative z-10 pb-24">
                    <div className="max-w-4xl mx-auto px-4 lg:px-8">
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <Calendar className="w-5 h-5 text-[var(--gold)]" />
                                    <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide">Date</h3>
                                </div>
                                <p className="text-lg font-bold text-white">{event.date}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <Clock className="w-5 h-5 text-[var(--gold)]" />
                                    <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide">Time</h3>
                                </div>
                                <p className="text-lg font-bold text-white">{event.time}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <MapPin className="w-5 h-5 text-[var(--gold)]" />
                                    <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide">Location</h3>
                                </div>
                                <p className="text-lg font-bold text-white">{event.location}</p>
                            </div>
                        </div>

                        {/* Full Description */}
                        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg border-2 border-gray-200">
                            <h2 className="text-2xl font-bold text-[var(--blue-darkest)] mb-4">About This Event</h2>
                            <p className="text-gray-700 leading-relaxed text-base">
                                {event.fullDescription}
                            </p>
                        </div>

                        {/* Agenda */}
                        {event.agenda && (
                            <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg border-2 border-gray-200">
                                <h2 className="text-2xl font-bold text-[var(--blue-darkest)] mb-6 flex items-center gap-2">
                                    <Clock className="w-6 h-6 text-[var(--gold)]" />
                                    Event Agenda
                                </h2>
                                <ul className="space-y-3">
                                    {event.agenda.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] font-bold flex items-center justify-center text-sm">
                                                {index + 1}
                                            </span>
                                            <span className="text-gray-700 text-base pt-1">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Speakers */}
                        {event.speakers && (
                            <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg border-2 border-gray-200">
                                <h2 className="text-2xl font-bold text-[var(--blue-darkest)] mb-6 flex items-center gap-2">
                                    <Users className="w-6 h-6 text-[var(--gold)]" />
                                    Featured Speakers
                                </h2>
                                <ul className="space-y-3">
                                    {event.speakers.map((speaker, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-[var(--gold)]"></div>
                                            <span className="text-gray-700 text-base">{speaker}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Registration CTA */}
                        <div className="bg-gradient-to-br from-[var(--gold)] to-[var(--gold)]/80 rounded-2xl p-8 text-center shadow-lg">
                            <h2 className="text-2xl font-bold text-[var(--blue-darkest)] mb-4">
                                Ready to Join This Event?
                            </h2>
                            <p className="text-[var(--blue-darkest)]/80 mb-6">
                                Register now to secure your spot and get all the details delivered to your inbox.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    variant="primary"
                                    href={event.registrationLink || "/get-in-touch"}
                                    className="bg-[var(--blue-darkest)] text-white hover:bg-[var(--blue-dark)]"
                                >
                                    Register Now
                                </Button>
                                <Button
                                    variant="outline"
                                    href="/get-in-touch"
                                    className="border-2 border-[var(--blue-darkest)] text-[var(--blue-darkest)] hover:bg-[var(--blue-darkest)] hover:text-white"
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Contact Us
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}

