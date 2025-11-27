"use client";

import { useState } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface LeadTrapModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

export default function LeadTrapModal({ isOpen, onClose, title = "Unlock Exclusive Details" }: LeadTrapModalProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            // In a real app, you would send this data to your backend
            console.log("Lead captured:", { name, phone });

            // Close after showing success message
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setName("");
                setPhone("");
            }, 2000);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-dark-bg border border-gold/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="p-8">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-white mb-2">Thank You!</h3>
                            <p className="text-white/70">We've unlocked the details for you.</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl font-serif font-bold text-white mb-2 text-center">
                                {title}
                            </h3>
                            <p className="text-white/70 text-center mb-6 text-sm">
                                Please provide your details to view pricing and floor plans.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-white/70 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={clsx(
                                        "w-full bg-gold text-dark-bg font-bold py-3 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]",
                                        isSubmitting && "opacity-70 cursor-not-allowed"
                                    )}
                                >
                                    {isSubmitting ? "Unlocking..." : "Unlock Details"}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                {/* Decorative bottom border */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
            </div>
        </div>
    );
}
