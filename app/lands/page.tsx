"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Ruler, Trees, Navigation, ArrowUpRight } from "lucide-react";
import Image from "next/image";


import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

export default function LandsPage() {
    const [properties, setProperties] = useState<any[]>([]);

    useEffect(() => {
        const fetchProperties = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('category', 'Land');

            if (data) {
                const mapped = data.map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    location: p.location,
                    price: p.price_text,
                    image: p.cover_image_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2532",
                    zone: p.amenities?.find((t: string) => t.includes("Zone")) || "Residential Zone",
                    area: p.amenities?.find((t: string) => t.includes("Cents") || t.includes("Acres")) || "On Request",
                    tags: p.amenities || []
                }));
                setProperties(mapped);
            } else if (error) {
                console.error("Error fetching land properties:", error);
            }
        };
        fetchProperties();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30">
            {/* --- Hero Section --- */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2532&auto=format&fit=crop"
                        alt="Green Landscape"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/40 to-neutral-950" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
                            Prime Land <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                                Investments
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
                            Secure your piece of earth. From beachfront plots to hilltop estates, discover premium land opportunities in Mangalore.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- Main Content --- */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Property Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.length > 0 ? (
                        properties.map((property, index) => (
                            <motion.div
                                key={property.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-neutral-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                            >
                                {/* Image Section */}
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={property.image}
                                        alt={property.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

                                    {/* Zone Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                            {property.zone}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-serif font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                                                {property.title}
                                            </h3>
                                            <div className="flex items-center text-neutral-400 text-sm">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {property.location}
                                            </div>
                                        </div>
                                        <div className="bg-neutral-800/50 p-2 rounded-lg border border-white/5">
                                            <Trees className="w-5 h-5 text-emerald-500" />
                                        </div>
                                    </div>

                                    {/* Key Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-neutral-950/50 p-3 rounded-xl border border-white/5">
                                            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Plot Area</p>
                                            <p className="text-lg font-bold text-white flex items-center">
                                                <Ruler className="w-4 h-4 mr-2 text-emerald-500" />
                                                {property.area}
                                            </p>
                                        </div>
                                        <div className="bg-neutral-950/50 p-3 rounded-xl border border-white/5">
                                            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Price / Cent</p>
                                            <p className="text-lg font-bold text-emerald-400">
                                                {property.price}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {property.tags.map((tag: string) => (
                                            <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-neutral-400 border border-white/5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <span className="text-sm text-neutral-400">Contact for Price</span>
                                        <button className="px-5 py-2 rounded-lg bg-white text-neutral-950 font-semibold text-sm hover:bg-emerald-400 transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-white/50">
                            <p>No land properties found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
