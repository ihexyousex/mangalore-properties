"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, MapPin, Building2, Calendar, Trophy, ExternalLink, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function BuilderDetailPage() {
    const params = useParams();
    const id = params.id;
    const [builder, setBuilder] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            // Fetch Builder Details
            const { data: builderData, error: builderError } = await supabase
                .from('builders')
                .select('*')
                .eq('id', id)
                .single();

            if (builderData) {
                setBuilder(builderData);

                // Fetch Builder's Projects
                const { data: projectsData, error: projectsError } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('builder_id', id);

                if (projectsData) {
                    setProjects(projectsData);
                }
            } else {
                console.error("Error fetching builder:", builderError);
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (!builder) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
                <p>Builder not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500/30 pt-24 pb-20">
            {/* --- Hero / Profile Section --- */}
            <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-neutral-950 to-neutral-950" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-5xl mx-auto bg-neutral-900/40 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
                            {/* Logo */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-white flex-shrink-0 flex items-center justify-center overflow-hidden border-4 border-white/10 shadow-2xl"
                            >
                                <Image
                                    src={builder.logo_url || "https://via.placeholder.com/150"}
                                    alt={builder.name}
                                    width={180}
                                    height={180}
                                    className="object-contain w-full h-full p-4"
                                />
                            </motion.div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-4xl md:text-5xl font-serif font-bold text-white mb-4"
                                >
                                    {builder.name}
                                </motion.h1>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex flex-wrap justify-center md:justify-start gap-6 mb-6 text-neutral-300"
                                >
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-amber-500" />
                                        <span>Since {builder.established_year}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-amber-500" />
                                        <span>{builder.total_projects}+ Projects</span>
                                    </div>
                                    {builder.website_url && (
                                        <a href={builder.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                                            <ExternalLink className="w-5 h-5 text-amber-500" />
                                            <span>Visit Website</span>
                                        </a>
                                    )}
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-neutral-400 text-lg leading-relaxed mb-8"
                                >
                                    {builder.description}
                                </motion.p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Portfolio / History Section --- */}
            <div className="container mx-auto px-4 mt-20">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                            Project <span className="text-amber-500">Portfolio</span>
                        </h2>
                        <div className="h-px flex-1 bg-white/10 ml-8 hidden md:block" />
                    </div>

                    {/* Portfolio Images Grid (if available) */}
                    {builder.portfolio_images && builder.portfolio_images.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                            {builder.portfolio_images.map((img: string, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + (idx * 0.1) }}
                                    className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-white/5 group"
                                >
                                    <Image
                                        src={img}
                                        alt={`${builder.name} Portfolio ${idx + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-amber-500 text-neutral-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            Completed Landmark
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Current Listings Grid */}
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        Current Listings on Mangalore Properties
                    </h3>

                    {projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-neutral-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={project.cover_image_url || "https://via.placeholder.com/600x400"}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${project.status === 'Ready to Move' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-neutral-950'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                                            {project.title}
                                        </h4>
                                        <div className="flex items-center text-neutral-400 text-sm mb-4">
                                            <MapPin className="w-4 h-4 mr-1 text-amber-500" />
                                            {project.location}
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <span className="text-lg font-bold text-white">{project.price_text}</span>
                                            <Link href={`/projects/${project.id}`} className="text-amber-500 hover:text-amber-400 text-sm font-bold flex items-center gap-1">
                                                View Details <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-neutral-900/20 rounded-2xl border border-white/5 border-dashed">
                            <p className="text-neutral-500">No active listings found for this builder.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
