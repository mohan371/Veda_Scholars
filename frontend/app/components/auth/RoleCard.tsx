import React from "react";
import { LucideIcon } from "lucide-react";

interface RoleCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    onClick: () => void;
    isSelected?: boolean;
}

export const RoleCard: React.FC<RoleCardProps> = ({
    title,
    description,
    icon: Icon,
    onClick,
    isSelected,
}) => {
    return (
        <div
            onClick={onClick}
            className={`
        cursor-pointer 
        relative 
        flex flex-col items-center justify-center 
        p-8 
        rounded-2xl 
        border
        transition-all duration-300 
        hover:shadow-[0_0_30px_var(--gold-glow-alt-light)] hover:scale-105
        ${isSelected
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 shadow-[0_0_20px_var(--gold-glow-alt-medium)]"
                    : "border-white/10 bg-white/5 hover:border-[var(--gold)]/50 hover:bg-white/10"
                }
      `}
        >
            <div className={`
        p-4 rounded-full mb-4 transition-colors duration-300
        ${isSelected ? "bg-[var(--gold)] text-gray-900" : "bg-white/10 text-[var(--gold)] group-hover:bg-[var(--gold)] group-hover:text-gray-900"}
      `}>
                <Icon size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-300 text-center">{description}</p>
        </div>
    );
};
