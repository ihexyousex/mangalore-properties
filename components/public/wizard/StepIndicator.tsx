"use client";

import { motion } from "framer-motion";

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full mb-6">
            <div className="flex justify-between text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round(progress)}% Completed</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
}
