"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface SelectionChipProps {
    label: string;
    isSelected: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
    subLabel?: string;
}

export default function SelectionChip({ label, isSelected, onClick, icon, subLabel }: SelectionChipProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={clsx(
                "relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 w-full min-h-[80px]",
                isSelected
                    ? "bg-yellow-500 text-neutral-950 border-yellow-500 shadow-lg shadow-yellow-500/20"
                    : "bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20"
            )}
        >
            {isSelected && (
                <div className="absolute top-2 right-2">
                    <Check className="w-4 h-4" />
                </div>
            )}

            {icon && (
                <div className={clsx("mb-2", isSelected ? "text-neutral-950" : "text-yellow-500")}>
                    {icon}
                </div>
            )}

            <span className="font-semibold text-lg">{label}</span>
            {subLabel && (
                <span className={clsx("text-xs mt-1", isSelected ? "text-neutral-800" : "text-white/60")}>
                    {subLabel}
                </span>
            )}
        </motion.button>
    );
}
