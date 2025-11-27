"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, CheckSquare, Square } from "lucide-react";
import clsx from "clsx";
import { useUser } from "./UserProvider";
import FavoriteButton from "./FavoriteButton";
import { BLUR_DATA_URL } from "@/lib/constants";

interface Project {
    id: number | string;
    name?: string;
    title?: string;
    builder?: string;
    location: string;
    status?: string;
    price: string;
    image: string;
    type: string;
    badge?: string;
    badgeColor?: string;
}

interface PropertyCardProps {
    project: Project;
}

export default function PropertyCard({ project }: PropertyCardProps) {
    const { compareList, toggleCompare } = useUser();

    // Normalize data fields since we use different shapes in data.ts
    const title = project.name || project.title;
    const status = project.status || project.badge;
    const badgeColor = project.badgeColor || (status === "Ready to Move" ? "bg-green-500 text-white" : "bg-gold text-dark-bg");

    return (
        <div className="glass-panel rounded-2xl overflow-hidden group hover:border-gold/30 transition-all duration-300 flex flex-col relative">
            {/* Favorite Button */}
            <div className="absolute top-4 right-4 z-20">
                <FavoriteButton propertyId={project.id} propertyType={project.type} />
            </div>

            <Link href={`/projects/${project.id}`} className="flex flex-col h-full">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={project.image}
                        alt={`${title} in ${project.location}`}
                        fill
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Status Badge */}
                    <div
                        className={clsx(
                            "absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md",
                            badgeColor
                        )}
                    >
                        {status}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                        <p className="text-xs text-white/50 uppercase tracking-widest mb-1">
                            {project.builder || project.type}
                        </p>
                        <h3 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-gold transition-colors">
                            {title}
                        </h3>
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                            <MapPin size={16} className="text-gold" />
                            <span>{project.location}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                        {project.type === "upcoming" ? (
                            <div className="flex-1 flex justify-between items-center">
                                <span className="text-white/40 blur-sm select-none">
                                    ₹ XX Lakhs
                                </span>
                                <button className="text-xs font-bold bg-white/10 hover:bg-gold hover:text-dark-bg px-3 py-1.5 rounded transition-colors">
                                    Join Waitlist
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className="text-xl font-bold text-gold">
                                    {project.price}
                                </span>

                                <div className="flex items-center gap-3">
                                    {/* Compare Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleCompare(project.id);
                                        }}
                                        className="flex items-center gap-1 text-xs text-white/60 hover:text-gold transition-colors"
                                    >
                                        {compareList.includes(project.id) ? (
                                            <CheckSquare size={18} className="text-gold" />
                                        ) : (
                                            <Square size={18} />
                                        )}
                                        Compare
                                    </button>

                                    <button className="p-2 rounded-full bg-white/5 hover:bg-gold hover:text-dark-bg transition-colors group/btn">
                                        <ArrowRight size={20} className="group-hover/btn:-rotate-45 transition-transform duration-300" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
