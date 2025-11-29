"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function PartnersPage() {
    const [builders, setBuilders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
        const fetchBuilders = async () => {
            try {
                if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                    throw new Error("Supabase URL is missing");
                }

                const { data, error } = await supabase
                    .from('builders')
                    .select('*')
                    .order('total_projects', { ascending: false });

                if (data) {
                    setBuilders(data);
                } else if (error) {
                    console.error("Error fetching builders:", error);
                    setError(error.message);
                }
            } catch (err: any) {
                console.error("Unexpected error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBuilders();
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500/30 pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-white mb-6"
                    >
                        Partnered <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Builders</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-neutral-400 text-lg max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        We collaborate with Mangalore's most reputed developers to bring you
                        homes of exceptional quality, trust, and architectural brilliance.
                    </motion.p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-center text-red-500 mb-8 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                        <p>Error loading builders: {error}</p>
                    </div>
                )}

                {/* Builder Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {builders.map((builder, index) => (
                            <motion.div
                                key={builder.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={`/partners/${builder.id}`}
                                    className="group block h-full bg-neutral-900/40 border border-white/5 rounded-2xl p-8 hover:border-amber-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] relative overflow-hidden"
                                >
                                    {/* Hover Gradient Background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10 flex flex-col items-center text-center h-full">
                                        {/* Logo Container */}
                                        <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center mb-8 overflow-hidden border-4 border-white/5 group-hover:border-amber-500/30 transition-all duration-500 shadow-lg group-hover:scale-105">
                                            {/* Using standard img tag to avoid next/image config issues until restart */}
                                            <img
                                                src={builder.logo_url || "https://via.placeholder.com/150"}
                                                alt={`${builder.name} Logo`}
                                                className="object-contain w-full h-full p-2"
                                            />
                                        </div>

                                        <h3 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                                            {builder.name}
                                        </h3>

                                        {/* Stats Row */}
                                        <div className="flex items-center justify-center gap-6 mb-6 w-full border-t border-b border-white/5 py-4">
                                            <div className="flex flex-col items-center">
                                                <span className="text-amber-500 font-bold text-lg">{builder.established_year}</span>
                                                <span className="text-xs text-neutral-500 uppercase tracking-wider">Est.</span>
                                            </div>
                                            <div className="w-px h-8 bg-white/10" />
                                            <div className="flex flex-col items-center">
                                                <span className="text-white font-bold text-lg">{builder.total_projects}+</span>
                                                <span className="text-xs text-neutral-500 uppercase tracking-wider">Projects</span>
                                            </div>
                                        </div>

                                        <p className="text-neutral-400 text-sm line-clamp-3 mb-8 font-light leading-relaxed">
                                            {builder.description}
                                        </p>

                                        <div className="mt-auto">
                                            <span className="inline-flex items-center gap-2 text-amber-500 text-sm font-bold uppercase tracking-widest group-hover:gap-3 transition-all duration-300">
                                                View Portfolio <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
