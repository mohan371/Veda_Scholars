"use client";

import Image from "next/image";

const logos = [
    { name: "Harvard University", url: "https://logo.clearbit.com/harvard.edu" },
    { name: "University of Oxford", url: "https://logo.clearbit.com/ox.ac.uk" },
    { name: "Stanford University", url: "https://logo.clearbit.com/stanford.edu" },
    { name: "MIT", url: "https://logo.clearbit.com/mit.edu" },
    { name: "University of Cambridge", url: "https://logo.clearbit.com/cam.ac.uk" },
    { name: "UC Berkeley", url: "https://logo.clearbit.com/berkeley.edu" },
    { name: "Columbia University", url: "https://logo.clearbit.com/columbia.edu" },
    { name: "Yale University", url: "https://logo.clearbit.com/yale.edu" },
    { name: "Princeton University", url: "https://logo.clearbit.com/princeton.edu" },
    { name: "Caltech", url: "https://logo.clearbit.com/caltech.edu" },
    { name: "University of Chicago", url: "https://logo.clearbit.com/uchicago.edu" },
    { name: "UPenn", url: "https://logo.clearbit.com/upenn.edu" },
    { name: "Johns Hopkins", url: "https://logo.clearbit.com/jhu.edu" },
    { name: "ETH Zurich", url: "https://logo.clearbit.com/ethz.ch" },
    { name: "UCL", url: "https://logo.clearbit.com/ucl.ac.uk" },
];

export default function UniLogos() {
    return (
        <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 mb-8">
                <p className="text-center text-gray-500 font-medium">
                    Trusted by leading universities worldwide
                </p>
            </div>

            <div className="relative w-full">
                <div className="flex w-[200%] animate-marquee hover:pause">
                    {/* First set of logos */}
                    <div className="flex w-1/2 justify-around items-center gap-12 md:gap-20 px-4">
                        {logos.map((logo, index) => (
                            <div
                                key={`logo-1-${index}`}
                                className="relative w-16 h-16 md:w-20 md:h-20 transition-all duration-300 flex-shrink-0 hover:scale-110"
                                title={logo.name}
                            >
                                <Image
                                    src={logo.url}
                                    alt={`${logo.name} Logo`}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                        ))}
                    </div>

                    {/* Duplicate set for seamless scrolling */}
                    <div className="flex w-1/2 justify-around items-center gap-12 md:gap-20 px-4">
                        {logos.map((logo, index) => (
                            <div
                                key={`logo-2-${index}`}
                                className="relative w-16 h-16 md:w-20 md:h-20 transition-all duration-300 flex-shrink-0 hover:scale-110"
                                title={logo.name}
                            >
                                <Image
                                    src={logo.url}
                                    alt={`${logo.name} Logo`}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .hover\\:pause:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
