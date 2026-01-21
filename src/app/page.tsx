import Hero from "@/components/home/Hero";
import TrustSignals from "@/components/home/TrustSignals";
import ModelSection from "@/components/home/ModelSection";
import ServicesOverview from "@/components/home/ServicesOverview";
import Testimonials from "@/components/home/Testimonials";
import FinalCTA from "@/components/home/FinalCTA";
import FadeIn from "@/components/animations/FadeIn";

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Veda Scholars | Education to Employment Consultancy',
  description: 'Directing students from education to employment. Verified pathways for global careers in USA, UK, Canada, and more.',
  keywords: ['Study Abroad', 'Education Consultant', 'Career Mapping'],
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <TrustSignals />
      <ModelSection />
      <ServicesOverview />
      <Testimonials />
      <FinalCTA />
    </div>
  );
}
