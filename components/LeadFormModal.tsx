"use client";

import { X, Check } from "lucide-react";
import { useState } from "react";

type LeadFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    projectName: string;
};

import { supabase } from "@/lib/supabaseClient";

export default function LeadFormModal({
    isOpen,
    onClose,
    projectName,
}: LeadFormModalProps) {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const email = formData.get("email") as string;

        const { error } = await supabase
            .from('leads')
            .insert([{ name, phone, email, project: projectName }]);

        setLoading(false);

        if (error) {
            console.error("Error submitting lead:", error);
            alert("Failed to submit request. Please try again.");
        } else {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                onClose();
            }, 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-[#1a1a1a]/90 border border-gold/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {submitted ? (
                    <div className="text-center py-12 animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-white mb-2">
                            Request Sent!
                        </h2>
                        <p className="text-white/60">
                            We will contact you shortly with the best offer for {projectName}.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200 mb-2">
                                Get Best Offer
                            </h2>
                            <p className="text-white/60 text-sm">
                                Unlock exclusive deals for <span className="text-white">{projectName}</span>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gold uppercase tracking-wider">
                                    Name
                                </label>
                                <input
                                    required
                                    name="name"
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:border-gold/50 focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gold uppercase tracking-wider">
                                    Phone
                                </label>
                                <input
                                    required
                                    name="phone"
                                    type="tel"
                                    placeholder="Your Phone Number"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:border-gold/50 focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gold uppercase tracking-wider">
                                    Email (Optional)
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:border-gold/50 focus:outline-none transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gold text-dark-bg font-bold py-3.5 rounded-xl hover:bg-yellow-500 transition-colors shadow-lg shadow-gold/10 mt-4"
                            >
                                Submit Request
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
