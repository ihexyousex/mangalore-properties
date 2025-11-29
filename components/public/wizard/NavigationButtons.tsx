"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface NavigationButtonsProps {
    onBack: () => void;
    onNext: () => void;
    canGoBack: boolean;
    canGoNext: boolean;
    isLastStep: boolean;
    isSubmitting?: boolean;
}

export default function NavigationButtons({
    onBack,
    onNext,
    canGoBack,
    canGoNext,
    isLastStep,
    isSubmitting = false
}: NavigationButtonsProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-neutral-950/80 backdrop-blur-lg border-t border-white/10 z-50">
            <div className="max-w-xl mx-auto flex gap-4">
                {canGoBack && (
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={onNext}
                    disabled={!canGoNext || isSubmitting}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-full font-bold text-lg h-12 transition-all ${canGoNext
                            ? "bg-yellow-500 text-neutral-950 hover:bg-yellow-400 shadow-lg shadow-yellow-500/20"
                            : "bg-white/10 text-white/40 cursor-not-allowed"
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Publishing...
                        </>
                    ) : isLastStep ? (
                        "Post Property"
                    ) : (
                        <>
                            Next <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
