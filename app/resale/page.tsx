"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, BedDouble, Bath, Square, Phone, CheckCircle2, CheckSquare, Square as SquareIcon } from "lucide-react";
import Image from "next/image";

import { RESALE_PROPERTIES } from "@/lib/data";
import FavoriteButton from "@/components/FavoriteButton";
import { useUser } from "@/components/UserProvider";

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

export default function ResalePage() {
    const { compareList, toggleCompare } = useUser();
    const [properties, setProperties] = useState<any[]>([]);

    useEffect(() => {
        const fetchProperties = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('category', 'Resale');

            if (data) {
                const mapped = data.map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    location: p.location,
                    price: p.price_text,
                    image: p.cover_image_url || "https://images.unsplash.com/photo-1600596542815-27bfefd0c3c6?q=80&w=1000",
                    bedrooms: p.amenities?.find((t: string) => t.includes("BHK"))?.replace("BHK", "") || "-",
                    bathrooms: "-", // Not explicitly stored
                    size: "-", // Not explicitly stored
                    tags: p.amenities || [],
                    type: "Resale"
                }));
                setProperties(mapped);
            } else if (error) {
                console.error("Error fetching resale properties:", error);
            }
        };
        fetchProperties();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500/30 pt-24 pb-16">
            {/* --- Header Section --- */}
            <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                        Premium Resale Inventory <br />
                        <span className="text-amber-500 text-2xl md:text-3xl font-sans font-normal block mt-2">
                            - Verified Listings -
                        </span>
                    </h1>
                    Ready-to-move properties with verified titles, best market prices, and immediate possession.

                </motion.div>
            </div>

            {/* --- Listings List --- */}
            <div className="max-w-5xl mx-auto px-4 space-y-8">
                {properties.length > 0 ? (
                    properties.map((property, index) => (
                        <motion.div
                            key={property.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className="group bg-neutral-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 flex flex-col md:flex-row hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]"
                        >
                            {/* Image Section (Left) */}
                            <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                                <Image
                                    src={property.image}
                                    alt={property.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-amber-500 text-neutral-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                        Resale
                                    </span>
                                </div>

                                {/* Favorite Button */}
                                <div className="absolute top-4 right-4 z-20">
                                    <FavoriteButton propertyId={property.id} propertyType="Resale" />
                                </div>
                            </div>

                            {/* Content Section (Right) */}
                            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-2xl font-serif font-semibold text-white group-hover:text-amber-400 transition-colors">
                                                {property.title}
                                            </h3>
                                            <div className="flex items-center text-neutral-400 mt-1">
                                                <MapPin className="w-4 h-4 mr-1 text-amber-500" />
                                                {property.location}
                                            </div>
                                        </div>
                                        <p className="text-2xl font-bold text-white whitespace-nowrap">
                                            {property.price}
                                        </p>
                                    </div>

                                    {/* Specs */}
                                    <div className="flex items-center gap-6 my-6 text-neutral-300 text-sm">
                                        <div className="flex items-center gap-2">
                                            <BedDouble className="w-5 h-5 text-neutral-500" />
                                            <span>{property.bedrooms} Beds</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Bath className="w-5 h-5 text-neutral-500" />
                                            <span>{property.bathrooms} Baths</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Square className="w-5 h-5 text-neutral-500" />
                                            <span>{property.size}</span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {property.tags.map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 rounded-md bg-neutral-800 text-neutral-300 text-xs border border-white/5 flex items-center gap-1"
                                            >
                                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex items-center justify-end gap-4">
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
                                            <SquareIcon className="w-5 h-5" />
                                        )}
                                        Compare
                                    </button>
                                    <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 px-6 py-3 rounded-lg font-bold transition-colors shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]">
                                        <Phone className="w-5 h-5" />
                                        Contact Broker
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 text-white/50">
                        <p>No resale properties found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
