import React from 'react';
import { Shield, Star, Heart, FileText } from 'lucide-react';

export default function CoreValues() {
    const values = [
        {
            id: 1,
            name: "Integrity",
            description: "We adhere to the highest ethical standards. No hidden costs, no false promises.",
            icon: <Shield className="w-8 h-8 text-white" />
        },
        {
            id: 2,
            name: "Excellence",
            description: "We strive for perfection in every application, every essay, and every counseling session.",
            icon: <Star className="w-8 h-8 text-white" />
        },
        {
            id: 3,
            name: "Empathy",
            description: "We understand the anxiety of career planning. We listen, we care, and we guide.",
            icon: <Heart className="w-8 h-8 text-white" />
        },
        {
            id: 4,
            name: "Transparency",
            description: "Clear processes and honest feedback. You will always know where you stand.",
            icon: <FileText className="w-8 h-8 text-white" />
        }
    ];

    return (
        <section className="py-24 bg-slate-900 text-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Our Core Values</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        The principles that guide every decision we make and every student we help.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((v) => (
                        <div key={v.id} className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-secondary transition-colors group">
                            <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors duration-300">
                                {v.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{v.name}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {v.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
