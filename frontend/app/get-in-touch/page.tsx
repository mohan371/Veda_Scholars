"use client";

import { useState, useRef, useEffect } from "react";
import { Mail, MapPin, Phone, Send, Clock, Globe } from "lucide-react";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { client } from "../../lib/apollo-client";
import { useNotification } from "../components/NotificationProvider";
import { gql } from "@apollo/client";
import Captcha from "../components/Captcha";

const SUBMIT_CONTACT_FORM = gql`
  mutation SubmitContactForm($input: ContactFormInput!) {
    submitContactForm(input: $input) {
      success
      message
    }
  }
`;

export default function GetInTouchPage() {
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const isMountedRef = useRef(true);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email || 
            !formData.phone || !formData.subject || !formData.message) {
            showNotification("error", "Please fill in all fields");
            return;
        }

        // CAPTCHA validation
        if (!captchaToken) {
            showNotification("error", "Please complete the CAPTCHA verification");
            return;
        }

        setIsSubmitting(true);

        try {
            const { data } = await client.mutate({
                mutation: SUBMIT_CONTACT_FORM,
                variables: {
                    input: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        subject: formData.subject,
                        message: formData.message,
                    },
                },
            });

            // Only update state if component is still mounted
            if (!isMountedRef.current) return;

            if (data?.submitContactForm?.success) {
                showNotification("success", data.submitContactForm.message);
                // Reset form
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                });
                // Reset CAPTCHA
                setCaptchaToken(null);
            } else {
                showNotification("error", data?.submitContactForm?.message || "Failed to send message");
            }
        } catch (error: any) {
            // Only update state if component is still mounted
            if (!isMountedRef.current) return;
            
            console.error("Error submitting form:", error);
            showNotification(
                "error",
                error?.message || "Failed to send message. Please try again later."
            );
        } finally {
            if (isMountedRef.current) {
                setIsSubmitting(false);
            }
        }
    };
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] text-white selection:bg-[var(--gold)] selection:text-[var(--blue-darkest)]">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[var(--gold)]/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[var(--blue-medium-dark)]/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 z-10">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse"></span>
                        <span className="text-[var(--gold)] font-semibold text-sm tracking-wide">Contact Us</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 leading-tight tracking-tight">
                        Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/80">Conversation</span>
                    </h1>
                    <p className="text-sm md:text-base text-white/90 max-w-3xl mx-auto leading-relaxed mb-12 md:mb-16 px-4 md:px-0">
                        Whether you're a student dreaming of studying abroad or a university looking for partners, we're here to help you achieve your goals.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="relative pb-24 z-10">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                        {/* Contact Info Column */}
                        <div className="lg:col-span-1 space-y-6">
                            {[
                                {
                                    icon: <Mail className="w-6 h-6" />,
                                    title: "Email Us",
                                    content: "info@vedascholars.com",
                                    sub: "We reply within 24 hours",
                                    color: "text-blue-400"
                                },
                                {
                                    icon: <Phone className="w-6 h-6" />,
                                    title: "Call Us",
                                    content: "+91 7708722334",
                                    sub: "+44 7796271532 | +971 559196409",
                                    color: "text-green-400"
                                },
                                {
                                    icon: <MapPin className="w-6 h-6" />,
                                    title: "Our Locations",
                                    content: "India | UK | UAE",
                                    sub: "www.vedascholars.com",
                                    color: "text-red-400"
                                },
                                {
                                    icon: <Clock className="w-6 h-6" />,
                                    title: "Working Hours",
                                    content: "9:00 AM - 6:00 PM",
                                    sub: "Monday to Saturday",
                                    color: "text-[var(--gold)]"
                                }
                            ].map((item, index) => (
                                <div key={index} className="group relative bg-white rounded-lg p-6 shadow-md border-2 border-[var(--blue-medium-dark)]/30 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-[var(--gold)] overflow-hidden">
                                    {/* Gold light flash animation overlay */}
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent w-[150%] h-full shimmer-overlay"></div>
                                    </div>
                                    
                                    <div className="relative z-10 flex items-start gap-4">
                                        <div className={`p-3 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/30 ${item.color} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm md:text-base font-bold text-[var(--blue-darkest)] mb-1 group-hover:text-[var(--gold)] transition-colors">{item.title}</h3>
                                            <p className="text-sm md:text-base text-[var(--blue-medium)] font-medium mb-1">{item.content}</p>
                                            <p className="text-sm md:text-base text-[var(--blue-medium)]/70">{item.sub}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Global Support Card */}
                            <div className="group relative bg-white rounded-lg p-8 shadow-md border-2 border-[var(--blue-medium-dark)]/30 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-[var(--gold)] overflow-hidden">
                                {/* Gold light flash animation overlay */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent w-[150%] h-full shimmer-overlay"></div>
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center mb-4 border border-[var(--gold)]/30">
                                        <Globe className="w-6 h-6 text-[var(--gold)]" />
                                    </div>
                                    <h3 className="text-sm md:text-base font-bold text-[var(--blue-darkest)] mb-2 group-hover:text-[var(--gold)] transition-colors">Global Support</h3>
                                    <p className="text-sm md:text-base text-[var(--blue-medium)] leading-relaxed">
                                        With offices in India, UK, and UAE, we provide round-the-clock support for our students worldwide.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form Column */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg p-8 md:p-12 shadow-md border border-[var(--gold)]/30 relative overflow-hidden">
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--gold)]/10 flex items-center justify-center border-2 border-[var(--gold)]/30">
                                        <svg className="w-10 h-10 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--blue-darkest)] mb-4">
                                        Form Temporarily Unavailable
                                    </h2>
                                    <p className="text-base md:text-lg text-[var(--blue-medium)] max-w-md mx-auto leading-relaxed mb-6">
                                        We're currently upgrading our contact form to serve you better. Please check back soon!
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-sm text-[var(--blue-medium)]">
                                        <svg className="w-5 h-5 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>We'll be back shortly with an improved experience</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg p-8 md:p-12 shadow-md border border-[var(--gold)]/30 relative overflow-hidden">

                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--blue-darkest)] mb-2">Send us a Message</h2>
                                <p className="text-sm md:text-base text-[var(--blue-medium)] mb-10">Fill out the form below and our team will get back to you shortly.</p>

                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group">
                                            <label htmlFor="firstName" className="block text-sm font-medium text-[var(--blue-dark)] group-focus-within:text-[var(--gold)] transition-colors mb-2">First Name</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-[var(--blue-medium-dark)]/5 border-2 border-[var(--blue-medium-dark)]/30 rounded-lg px-4 py-3 text-[var(--blue-darkest)] placeholder-[var(--blue-medium)]/50 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label htmlFor="lastName" className="block text-sm font-medium text-[var(--blue-dark)] group-focus-within:text-[var(--gold)] transition-colors mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-[var(--blue-medium-dark)]/5 border-2 border-[var(--blue-medium-dark)]/30 rounded-lg px-4 py-3 text-[var(--blue-darkest)] placeholder-[var(--blue-medium)]/50 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group">
                                            <label htmlFor="email" className="block text-sm font-medium text-[var(--blue-dark)] group-focus-within:text-[var(--gold)] transition-colors mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-[var(--blue-medium-dark)]/5 border-2 border-[var(--blue-medium-dark)]/30 rounded-lg px-4 py-3 text-[var(--blue-darkest)] placeholder-[var(--blue-medium)]/50 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label htmlFor="phone" className="block text-sm font-medium text-[var(--blue-dark)] group-focus-within:text-[var(--gold)] transition-colors mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-[var(--blue-medium-dark)]/5 border-2 border-[var(--blue-medium-dark)]/30 rounded-lg px-4 py-3 text-[var(--blue-darkest)] placeholder-[var(--blue-medium)]/50 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
                                                placeholder="+91 7708722334"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label htmlFor="subject" className="block text-sm font-medium text-[var(--blue-dark)] group-focus-within:text-[var(--gold)] transition-colors mb-2">Subject</label>
                                        <select
                                            id="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-[var(--blue-medium-dark)]/5 border-2 border-[var(--blue-medium-dark)]/30 rounded-lg px-4 py-3 text-[var(--blue-darkest)] focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all [&>option]:bg-white [&>option]:text-[var(--blue-darkest)] cursor-pointer"
                                        >
                                            <option value="">Select a topic</option>
                                            <option value="University Admissions">University Admissions</option>
                                            <option value="Career Counseling">Career Counseling</option>
                                            <option value="University Partnership">University Partnership</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label htmlFor="message" className="block text-sm font-medium text-[var(--blue-dark)] group-focus-within:text-[var(--gold)] transition-colors mb-2">Message</label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-[var(--blue-medium-dark)]/5 border-2 border-[var(--blue-medium-dark)]/30 rounded-lg px-4 py-3 text-[var(--blue-darkest)] placeholder-[var(--blue-medium)]/50 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all resize-none"
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>

                                    <Captcha 
                                        onChange={(token) => setCaptchaToken(token)}
                                        onExpired={() => setCaptchaToken(null)}
                                        onError={() => {
                                            setCaptchaToken(null);
                                            showNotification("error", "CAPTCHA verification failed. Please try again.");
                                        }}
                                    />
                                    <div className="pt-4">
                                        <Button 
                                            variant="primary" 
                                            type="submit" 
                                            disabled={isSubmitting || !captchaToken}
                                            className="w-full md:w-auto px-10 py-4 text-lg shadow-[0_0_20px_var(--gold-glow-alt-light)] hover:shadow-[0_0_30px_var(--gold-glow-alt-strong)] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="flex items-center gap-3">
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        Send Message
                                                        <Send size={20} />
                                                    </>
                                                )}
                                            </span>
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div> */}
                    </div>
                </div>
            </section>
            </div>
            <Footer />
        </main>
    );
}
