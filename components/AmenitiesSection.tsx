"use client";

import { useState } from "react";
import { Stethoscope, Waves, ShieldCheck, TreePine, Gamepad2, Wine, Zap, Sparkles } from "lucide-react";
import AmenityModal from "@/components/AmenityModal";

export default function AmenitiesSection({ amenities }: { amenities: any[] }) {
    const [selectedAmenity, setSelectedAmenity] = useState<{ name: string; image: string } | null>(null);

    // Amenity Icon Mapping
    const getAmenityIcon = (name: string) => {
        if (!name) return <Sparkles size={24} />;
        const lower = name.toLowerCase();
        if (lower.includes("gym") || lower.includes("fitness")) return <Stethoscope size={24} />;
        if (lower.includes("pool") || lower.includes("swim")) return <Waves size={24} />;
        if (lower.includes("security") || lower.includes("cctv")) return <ShieldCheck size={24} />;
        if (lower.includes("park") || lower.includes("garden")) return <TreePine size={24} />;
        if (lower.includes("play") || lower.includes("kid")) return <Gamepad2 size={24} />;
        if (lower.includes("club")) return <Wine size={24} />;
        if (lower.includes("power") || lower.includes("backup")) return <Zap size={24} />;
        return <Sparkles size={24} />;
    };

    if (!amenities || !Array.isArray(amenities) || amenities.length === 0) return null;

    return (
        <section>
            <h2 className="text-2xl font-serif font-bold text-gold mb-6">World-Class Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {amenities.map((item: any, index: number) => {
                    const amenityName = typeof item === 'string' ? item : item?.name || "Amenity";
                    const amenityImage = typeof item === 'string' ? "" : item?.image || "";

                    return (
                        <button
                            key={index}
                            onClick={() => setSelectedAmenity({ name: amenityName, image: amenityImage })}
                            className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="text-gold group-hover:scale-110 transition-transform relative z-10">
                                {getAmenityIcon(amenityName)}
                            </div>
                            <span className="text-white/80 font-medium text-center text-sm relative z-10 group-hover:text-gold transition-colors">
                                {amenityName}
                            </span>
                        </button>
                    );
                })}
            </div>

            <AmenityModal
                isOpen={!!selectedAmenity}
                onClose={() => setSelectedAmenity(null)}
                amenity={selectedAmenity}
            />
        </section>
    );
}
