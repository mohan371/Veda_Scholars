import React from 'react';
import ServicesHero from '@/components/services/ServicesHero';
import ServiceDetailedList from '@/components/services/ServiceDetailedList';
import FinalCTA from '@/components/home/FinalCTA';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Comprehensive Education & Recruitment Services | Veda Scholars',
    description: 'End-to-end support: University Admissions, Skill Development, and Global Placements. A vertical integration model.',
    keywords: ['Recruitment Services', 'Skill Training', 'University Admissions', 'Corporate Training', 'Placement Services'],
};

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-white">
            <ServicesHero />
            <ServiceDetailedList />
            <FinalCTA />
        </div>
    );
}
