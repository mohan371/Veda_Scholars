'use client';

import React, { useState } from 'react';
import Button from '../ui/Button';
import { Send } from 'lucide-react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        interest: 'Study Abroad'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for actual submission logic
        console.log('Form Submitted', formData);
        alert('Thank you! We will contact you soon.');
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">I'm interested in</label>
                    <select
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white"
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    >
                        <option>Study Abroad Counselling</option>
                        <option>Job/Placement Support</option>
                        <option>Skill Development Training</option>
                        <option>University Partnership</option>
                    </select>
                </div>

                <Button id="form-consultation-submit" variant="primary" className="w-full justify-center py-4 text-lg shadow-xl shadow-primary/20">
                    Submit Request <Send className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-xs text-slate-400 text-center mt-4">
                    By submitting this form, you agree to our <a href="/privacy-policy" className="underline hover:text-primary">privacy policy</a>. Your information is safe with us.
                </p>
            </form>
        </div>
    );
}
