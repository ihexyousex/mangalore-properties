"use client";

import { X } from "lucide-react";
import Image from "next/image";

interface AmenityModalProps {
    isOpen: boolean;
    onClose: () => void;
    amenity: { name: string; image: string } | null;
}

export default function AmenityModal({ isOpen, onClose, amenity }: AmenityModalProps) {
    if (!isOpen || !amenity) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-dark-bg border border-gold/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-gold hover:text-dark-bg transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="relative aspect-video w-full">
                    <Image
                        src={amenity.image}
                        alt={amenity.name}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 pt-20">
                        <h3 className="text-3xl font-serif font-bold text-white">{amenity.name}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
