"use client";

import { motion } from "framer-motion";
import { Building2, Home, KeyRound, Building } from "lucide-react";
import { ListingType } from "@/stores/useListingStore";

interface ListingTypeCardProps {
    type: ListingType;
    title: string;
    description: string;
    icon: React.ReactNode;
    isSelected: boolean;
    onClick: () => void;
}

export default function ListingTypeCard({
    type,
    title,
    description,
    icon,
    isSelected,
    onClick,
}: ListingTypeCardProps) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            className={`
        relative group w-full p-8 rounded-2xl border-2 transition-all duration-300
        ${isSelected
                    ? "border-yellow-500 bg-yellow-500/10 shadow-[0_0_30px_rgba(234,179,8,0.3)]"
                    : "border-white/10 bg-white/5 hover:border-yellow-500/50 hover:bg-white/10"
                }
        backdrop-blur-md
      `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Icon */}
            <div className={`
        w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center transition-all
        ${isSelected ? "bg-yellow-500/20 text-yellow-500" : "bg-white/10 text-white/60 group-hover:bg-yellow-500/10 group-hover:text-yellow-500"}
      `}>
                {icon}
            </div>

            {/* Title */}
            <h3 className={`
        text-xl font-bold mb-2 transition-colors
        ${isSelected ? "text-yellow-500" : "text-white group-hover:text-yellow-500"}
      `}>
                {title}
            </h3>

            {/* Description */}
            <p className="text-sm text-white/60">
                {description}
            </p>

            {/* Selected indicator */}
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center"
                >
                    <svg className="w-4 h-4 text-neutral-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </motion.div>
            )}
        </motion.button>
    );
}

// Predefined listing types with their metadata
export const LISTING_TYPES = [
    {
        type: 'builder_new' as ListingType,
        title: 'New Construction',
        description: 'Projects by builders and developers',
        icon: <Building2 className="w-8 h-8" />,
    },
    {
        type: 'resale_residential' as ListingType,
        title: 'Resale Property',
        description: 'Ready-to-move homes for sale',
        icon: <Home className="w-8 h-8" />,
    },
    {
        type: 'rent_residential' as ListingType,
        title: 'Rental Home',
        description: 'Residential properties for rent',
        icon: <KeyRound className="w-8 h-8" />,
    },
    {
        type: 'commercial_sell' as ListingType,
        title: 'Commercial Space',
        description: 'Office, retail, and commercial properties',
        icon: <Building className="w-8 h-8" />,
    },
];
