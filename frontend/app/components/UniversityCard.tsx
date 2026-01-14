import Image from "next/image";
import Link from "next/link";

interface UniversityCardProps {
    id: number | string;
    name: string;
    location: string;
    country: string;
    logoUrl: string;
    description: string;
}

export default function UniversityCard({
    id,
    name,
    location,
    country,
    logoUrl,
    description,
}: UniversityCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 bg-white flex-shrink-0">
                    <Image
                        src={logoUrl}
                        alt={`${name} logo`}
                        fill
                        className="object-contain p-2"
                        unoptimized
                    />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-[var(--blue-old)] group-hover:text-[var(--gold)] transition-colors line-clamp-2">
                        {name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <svg
                            className="w-4 h-4 text-[var(--gold)]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        <span>{location}, {country}</span>
                    </div>
                </div>
            </div>

            <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                {description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-xs font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                    Partner University
                </span>
                <Link
                    href={`/universities/${id}`}
                    className="text-sm font-semibold text-[var(--gold)] hover:underline flex items-center gap-1"
                >
                    View Details
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
