"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, ArrowUpRight, Briefcase, Store, LayoutGrid, CheckSquare, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


import FavoriteButton from "@/components/FavoriteButton";
import { useUser } from "@/components/UserProvider";

import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";

const FILTERS = ["All", "Office Spaces", "Retail Shops", "Showrooms"];

export default function CommercialPage() {
    const { compareList, toggleCompare } = useUser();
    const [activeFilter, setActiveFilter] = useState("All");
    const [properties, setProperties] = useState<any[]>([]);

    useEffect(() => {
        const fetchProperties = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('category', 'Commercial');

            if (data) {
                const mapped = data.map((p: any) => {
                    // Try to determine specific type from amenities or title
                    let type = "Office Spaces"; // Default
                    const lowerTitle = p.title.toLowerCase();
                    const tags = p.amenities || [];
                    if (tags.includes("Retail") || lowerTitle.includes("retail")) type = "Retail Shops";
                    if (tags.includes("Showroom") || lowerTitle.includes("showroom")) type = "Showrooms";

                    return {
                        id: p.id,
                        title: p.title,
                        location: p.location,
                        price: p.price_text,
                        image: p.cover_image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
                        roi: "5-8%", // Placeholder as dynamic calculation is complex
                        carpetArea: p.amenities?.find((t: string) => t.includes("Sq.Ft")) || "On Request",
                        type: type,
                        tags: tags
                    };
                });
                setProperties(mapped);
            } else if (error) {
                console.error("Error fetching commercial properties:", error);
            }
        };
        fetchProperties();
    }, []);

    const filteredProperties =
        activeFilter === "All"
            ? properties
            : properties.filter((p) => p.type === activeFilter);

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500/30">
            {/* --- Hero Section --- */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2370&auto=format&fit=crop"
                        alt="Modern Glass Office Building"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
                            Commercial Spaces <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                                for Visionaries
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
                            Premium office spaces, retail outlets, and showrooms designed for
                            high-growth businesses and smart investors.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- Main Content --- */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Smart Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${activeFilter === filter
                                ? "bg-amber-500 text-neutral-950 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                                : "bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-amber-500/50 hover:text-white backdrop-blur-sm"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Property Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProperties.length > 0 ? (
                        filteredProperties.map((property, index) => (
                            <motion.div
                                key={property.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-neutral-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col"
                            >
                                {/* Image Section */}
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={property.image}
                                        alt={property.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-xl font-serif font-semibold text-white mb-1 group-hover:text-amber-400 transition-colors">
                                            {property.title}
                                        </h3>
                                        <div className="flex items-center text-neutral-300 text-sm">
                                            <MapPin className="w-3 h-3 mr-1 text-amber-500" />
                                            {property.location}
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-neutral-900/80 backdrop-blur-md p-2 rounded-lg border border-white/10">
                                        {property.type === "Office Spaces" && <Briefcase className="w-5 h-5 text-amber-500" />}
                                        {property.type === "Retail Shops" && <Store className="w-5 h-5 text-amber-500" />}
                                        {property.type === "Showrooms" && <LayoutGrid className="w-5 h-5 text-amber-500" />}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex flex-col flex-grow">
                                    {/* Key Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-neutral-950/50 p-3 rounded-xl border border-white/5">
                                            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">ROI / Yield</p>
                                            <p className="text-lg font-bold text-amber-400 flex items-center">
                                                {property.roi}
                                                <ArrowUpRight className="w-4 h-4 ml-1" />
                                            </p>
                                        </div>
                                        <div className="bg-neutral-950/50 p-3 rounded-xl border border-white/5">
                                            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Carpet Area</p>
                                            <p className="text-lg font-bold text-white">{property.carpetArea}</p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                        <p className="text-2xl font-serif text-white">{property.price}</p>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleCompare(property.id);
                                                }}
                                                className="flex items-center gap-2 text-sm text-neutral-400 hover:text-amber-500 transition-colors"
                                            >
                                                {compareList.includes(property.id) ? (
                                                    <CheckSquare className="w-5 h-5 text-amber-500" />
                                                ) : (
                                                    <Square className="w-5 h-5" />
                                                )}
                                            </button>
                                            <FavoriteButton propertyId={property.id} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-white/50">
                            <p>No commercial properties found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
