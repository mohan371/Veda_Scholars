import StudentsHero from '@/components/students/StudentsHero';
import StudentProcess from '@/components/students/StudentProcess';
import StudentBenefits from '@/components/students/StudentBenefits';
import StudentFAQ from '@/components/students/StudentFAQ';
import FinalCTA from '@/components/home/FinalCTA';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Student Guidance & Career Counselling | Veda Scholars',
    description: 'Find clarity, not just admission. Personal mentorship for students aspiring to study and work abroad. Free counselling available.',
    keywords: ['Student Guidance', 'Scholarship Help', 'Study Abroad mentorship', 'Career Counselling', 'Pre-departure training'],
};

export default function StudentsPage() {
    return (
        <div className="min-h-screen bg-white">
            <StudentsHero />
            <StudentProcess />
            <StudentBenefits />
            <StudentFAQ />
            <FinalCTA />
        </div>
    );
}
