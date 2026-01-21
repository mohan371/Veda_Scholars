import AboutHero from '@/components/about/AboutHero';
import VisionMission from '@/components/about/VisionMission';
import FounderStory from '@/components/about/FounderStory';
import CoreValues from '@/components/about/CoreValues';
import WhyChooseUs from '@/components/about/WhyChooseUs';
import FinalCTA from '@/components/home/FinalCTA'; // Reusing Final CTA

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Veda Scholars | Bridging Education & Careers',
    description: 'We are more than agents. We are career architects building ethical bridges between universities and global employers.',
    keywords: ['Ethical Counseling', 'Veda Scholars Story', 'Career Architects', 'Study Abroad Consultants'],
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <AboutHero />
            <VisionMission />
            <FounderStory />
            <CoreValues />
            <WhyChooseUs />
            <FinalCTA />
        </div>
    );
}
