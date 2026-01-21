import React from 'react';
import Image from 'next/image';

export default function StudentsHero() {
    return (
        <section className="relative h-[600px] flex items-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/students/counselling.png"
                    alt="Career Counselling Session"
                    fill
                    className="object-cover brightness-50"
                    priority
                />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-white">
                <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight text-white">
                        Find Clarity in Your <br /> <span className="text-secondary">Career Path</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-200 mb-8 leading-relaxed">
                        Confusion is normal. We help you cut through the noise, understand your strengths, and build a future that excites you.
                    </p>
                </div>
            </div>
        </section>
    );
}
