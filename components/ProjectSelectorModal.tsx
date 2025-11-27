"use client";

import { X, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PROJECTS, RESALE_PROPERTIES, COMMERCIAL_PROPERTIES, LAND_PROPERTIES } from "@/lib/data";

type ProjectSelectorModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (projectId: number | string) => void;
    excludeIds: (number | string)[];
};

export default function ProjectSelectorModal({
    isOpen,
    onClose,
    onSelect,
    excludeIds,
}: ProjectSelectorModalProps) {
    const [search, setSearch] = useState("");

    if (!isOpen) return null;

    // Combine all properties
    const ALL_PROPERTIES = [
        ...PROJECTS,
        ...RESALE_PROPERTIES.map(p => ({ ...p, name: p.title, status: "Resale" })),
        ...COMMERCIAL_PROPERTIES.map(p => ({ ...p, name: p.title, status: "Commercial" })),
        ...LAND_PROPERTIES.map(p => ({ ...p, name: p.title, status: "Land" }))
    ];

    const filteredProjects = ALL_PROPERTIES.filter(
        (p) =>
            !excludeIds.includes(p.id) &&
            p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-[#1a1a1a]/90 border border-gold/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-serif font-bold text-white">
                        Select Project
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="relative mb-6">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                        size={20}
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search projects..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-gold/50 focus:outline-none transition-colors"
                        autoFocus
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-12 text-white/40">
                            No projects found matching "{search}"
                        </div>
                    ) : (
                        filteredProjects.map((project) => (
                            <button
                                key={project.id}
                                onClick={() => onSelect(project.id)}
                                className="w-full flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-gold/30 transition-all group text-left"
                            >
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={project.image}
                                        alt={project.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-white/60">{project.location}</p>
                                    <p className="text-sm text-gold mt-1">{project.price}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
