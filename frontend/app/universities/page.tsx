"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UniHero from "./components/UniHero";
// import UniLogos from "./components/UniLogos";
import UniSteps from "./components/UniSteps";
import UniServices from "./components/UniServices";
import UniFAQ from "./components/UniFAQ";
import Button from "../components/Button";

export default function UniversitiesPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <UniHero />
            {/* <UniLogos /> */}
            <UniSteps />
            <UniServices />

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--gold)]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                </div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to boost your international student employability?
                    </h2>
                    <p className="text-base md:text-lg text-white/80 mb-10">
                        Join 50+ universities already using Veda Scholars to support their international graduates.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button variant="primary" className="bg-[var(--gold)] text-[var(--blue-darkest)] hover:bg-white hover:text-[var(--blue-darkest)] border-none font-bold text-lg px-10 py-4 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                            Partner With Us
                        </Button>
                        <Button variant="outline" className="font-bold text-lg px-10 py-4">
                            Contact Sales
                        </Button>
                    </div>
                </div>
            </section>

            <UniFAQ />

            <Footer />
        </main>
    );
}
