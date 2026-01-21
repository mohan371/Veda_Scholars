import React from 'react';
import { BookOpen, Briefcase, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function ServiceDetailedList() {
    const services = [
        {
            id: 1,
            title: "Education Consultancy",
            icon: <BookOpen className="w-8 h-8 text-secondary" />,
            description: "We navigate the complex landscape of global education to find the perfect fit for your ambitions. Our guidance goes beyond rankings; we look at curriculum, campus culture, and career outcomes.",
            target: "High School Graduates, Undergraduates, Professionals aiming for Masters.",
            outcome: "Admission to a top-tier university with a scholarship strategy.",
            points: [
                "Unbiased University Selection",
                "SOP & Essay Mentoring",
                "Application Strategy & Review",
                "Visa Interview Preparation"
            ]
        },
        {
            id: 2,
            title: "Recruitment & Placement",
            icon: <Briefcase className="w-8 h-8 text-secondary" />,
            description: "Your degree is the starting line, not the finish. We actively connect our scholars with our network of global recruiters, ensuring your talent finds the right opportunity.",
            target: "Recent Graduates, Alumni, Skilled Professionals.",
            outcome: "Placement in a role that aligns with your qualifications and goals.",
            points: [
                "Resume & LinkedIn Optimization",
                "Mock Interviews with HR Experts",
                "Direct Referrals to Hiring Partners",
                "Salary Negotiation Guidance"
            ]
        },
        {
            id: 3,
            title: "Training & Skill Development",
            icon: <Zap className="w-8 h-8 text-secondary" />,
            description: "The skills gap is real. We bridge it by providing industry-endorsed certifications and soft-skills training that make you day-one ready for the corporate world.",
            target: "Students wanting to boost employability.",
            outcome: "Industry-ready certification and enhanced professional confidence.",
            points: [
                "Technical Bootcamps",
                "Corporate Communication Workshops",
                "Leadership & Teamwork Modules",
                "Real-world Capstone Projects"
            ]
        }
    ];

    return (
        <div className="bg-white">
            {services.map((service, index) => (
                <section key={service.id} className={`py-20 md:py-28 ${index % 2 === 1 ? 'bg-slate-50' : 'bg-white'}`}>
                    <div className="container mx-auto px-4 md:px-6">
                        <div className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>

                            {/* Content */}
                            <div className="w-full lg:w-1/2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10">
                                        {service.icon}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
                                        {service.title}
                                    </h2>
                                </div>

                                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                    {service.description}
                                </p>

                                <div className="mb-8 p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
                                    <div className="mb-4">
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-1">Who it is for</span>
                                        <p className="text-slate-700 font-medium">{service.target}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-1">Outcome</span>
                                        <p className="text-secondary font-bold flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5" />
                                            {service.outcome}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                    {service.points.map((point, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                                            <span className="text-sm">{point}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button variant="primary" className="gap-2">
                                    Get Started <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Visual/Image Placeholder - Using a stylized abstract card for now to keep it clean without requiring new image generation yet */}
                            <div className="w-full lg:w-1/2">
                                <div className="aspect-square w-full max-w-md mx-auto bg-slate-900 rounded-2xl p-8 relative overflow-hidden shadow-2xl flex items-center justify-center group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-slate-900"></div>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                                    {/* Big Icon */}
                                    <div className="relative z-10 text-white/5 group-hover:text-white/10 transition-colors duration-500 transform group-hover:scale-110">
                                        {React.cloneElement(
                                            service.icon as React.ReactElement<{ className?: string }>,
                                            { className: "w-64 h-64" }
                                        )}
                                    </div>

                                    <div className="absolute bottom-8 left-8 right-8 z-20">
                                        <div className="h-1 w-20 bg-secondary rounded-full mb-4"></div>
                                        <p className="text-slate-300 font-heading text-2xl font-light">
                                            "Excellence in <br /> <span className="text-white font-bold">{service.title}</span>"
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
}
