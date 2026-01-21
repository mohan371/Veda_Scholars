import UniversitiesHero from '@/components/universities/UniversitiesHero';
import EmployabilityOutcomes from '@/components/universities/EmployabilityOutcomes';
import PartnershipProcess from '@/components/universities/PartnershipProcess';
import CaseStudySnippets from '@/components/universities/CaseStudySnippets';
import FinalCTA from '@/components/home/FinalCTA';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'University Partnerships & Recruitment Solutions | Veda Scholars',
    description: 'Partner with Veda to access pre-vetted, day-one ready talent. Improve retention and placement stats for your institution.',
    keywords: ['University Recruitment', 'Corporate Partnerships', 'Student Retention', 'Vetted Talent', 'Hiring Solutions'],
};

export default function UniversitiesPage() {
    return (
        <div className="min-h-screen bg-white">
            <UniversitiesHero />
            <EmployabilityOutcomes />
            <PartnershipProcess />
            <CaseStudySnippets />
            <FinalCTA />
        </div>
    );
}
