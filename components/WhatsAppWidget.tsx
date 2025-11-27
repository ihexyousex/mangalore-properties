"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppWidget() {
    const [showTooltip, setShowTooltip] = useState(false);
    const phoneNumber = "919876543210";
    const message = "Hi, I am interested in a property on Mangalore Properties.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    useEffect(() => {
        // Show tooltip after 5 seconds
        const timer = setTimeout(() => {
            setShowTooltip(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed bottom-24 md:bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-white text-dark-bg px-4 py-2 rounded-xl shadow-xl border border-gold/20 relative mr-2 mb-2"
                    >
                        <p className="text-sm font-bold">Chat with an Expert 👋</p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowTooltip(false);
                            }}
                            className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-0.5 hover:bg-gray-300 transition-colors"
                        >
                            <X size={12} />
                        </button>
                        {/* Arrow */}
                        <div className="absolute bottom-0 right-4 translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-gold/20"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Button */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setShowTooltip(true)}
                className="relative group"
            >
                {/* Pulse Animation */}
                <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-75 group-hover:animate-none"></div>

                <div className="relative bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg transition-all transform group-hover:scale-110 flex items-center justify-center">
                    <MessageCircle size={32} fill="white" className="text-white" />
                </div>
            </a>
        </div>
    );
}
