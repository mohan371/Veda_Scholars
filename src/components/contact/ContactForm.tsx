'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Button from '../ui/Button';
import { Send } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { useRouter } from 'next/navigation';

function ContactFormContent() {
    const searchParams = useSearchParams();
    const router = useRouter(); // Initialize router
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        interest: 'General Inquiry'
    });

    useEffect(() => {
        const type = searchParams.get('type');
        if (type === 'student') {
            setFormData(prev => ({ ...prev, interest: 'Student Counselling' }));
        } else if (type === 'partner') {
            setFormData(prev => ({ ...prev, interest: 'University Partnership' }));
        } else if (type === 'recruiter') {
            setFormData(prev => ({ ...prev, interest: 'Recruiter / Hiring' }));
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Disable button/show loading state if needed (optional enhancement)
        const submitBtn = document.getElementById('form-consultation-submit') as HTMLButtonElement;
        if (submitBtn) {
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Determine the type param for the thank you page based on interest
                let typeParam = 'general';
                if (formData.interest === 'Student Counselling') typeParam = 'student';
                else if (formData.interest === 'University Partnership') typeParam = 'partner';
                else if (formData.interest === 'Recruiter / Hiring') typeParam = 'recruiter';

                // Redirect to Thank You page
                router.push(`/thank-you?type=${typeParam}`);
            } else {
                alert('Something went wrong. Please try again.');
                if (submitBtn) {
                    submitBtn.innerHTML = 'Submit Request';
                    submitBtn.disabled = false;
                }
            }

        } catch (error) {
            console.error('Submission error:', error);
            alert('Error submitting form. Please try again later.');
            if (submitBtn) {
                submitBtn.innerHTML = 'Submit Request';
                submitBtn.disabled = false;
            }
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold text-primary mb-6">Book Your Free Consultation</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <input
                        type="tel"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Purpose of Inquiry</label>
                    <select
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white"
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    >
                        <option>General Inquiry</option>
                        <option>Student Counselling</option>
                        <option>University Partnership</option>
                        <option>Recruiter / Hiring</option>
                    </select>
                </div>

                <Button id="form-consultation-submit" type="submit" variant="primary" className="w-full md:w-auto md:px-12 justify-center py-4 text-lg shadow-xl shadow-primary/20 transition-transform hover:scale-[1.02]">
                    Submit Request <Send className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-xs text-slate-400 text-center mt-4">
                    By submitting this form, you agree to our <a href="/privacy-policy" className="underline hover:text-primary">privacy policy</a>. Your information is safe with us.
                </p>
            </form>
        </div>
    );
}

export default function ContactForm() {
    return (
        <Suspense fallback={<div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 h-[600px] flex items-center justify-center">Loading form...</div>}>
            <ContactFormContent />
        </Suspense>
    );
}
