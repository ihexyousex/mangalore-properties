"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ChevronRight, Building, MapPin, Briefcase, Trees, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import { PROJECTS, BUILDERS, RESALE_PROPERTIES, COMMERCIAL_PROPERTIES, LAND_PROPERTIES } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
    const [query, setQuery] = useState("");
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery(""); // Reset query on close
        }
    }, [isOpen]);

    // Handle Esc key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Search Logic
    const filteredProjects = PROJECTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.location.toLowerCase().includes(query.toLowerCase())
    );

    const filteredBuilders = BUILDERS.filter(b =>
        b.name.toLowerCase().includes(query.toLowerCase())
    );

    const filteredResale = RESALE_PROPERTIES.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.location.toLowerCase().includes(query.toLowerCase())
    );

    const filteredCommercial = COMMERCIAL_PROPERTIES.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.location.toLowerCase().includes(query.toLowerCase())
    );

    const filteredLand = LAND_PROPERTIES.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.location.toLowerCase().includes(query.toLowerCase())
    );

    const hasResults = query.length > 0 && (
        filteredProjects.length > 0 ||
        filteredBuilders.length > 0 ||
        filteredResale.length > 0 ||
        filteredCommercial.length > 0 ||
        filteredLand.length > 0
    );

    const handleNavigate = (path: string) => {
        router.push(path);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-start justify-center pt-20 px-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl bg-neutral-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            {/* Header / Input */}
                            <div className="p-4 border-b border-white/10 flex items-center gap-3">
                                <Search className="text-gold w-6 h-6" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search for builders, projects, or locations..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-white/30"
                                />
                                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                    <X className="text-white/50 w-5 h-5" />
                                </button>
                            </div>

                            {/* Results */}
                            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                                {!query && (
                                    <div className="p-8 text-center text-white/30">
                                        <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>Type to start searching...</p>
                                    </div>
                                )}

                                {query && !hasResults && (
                                    <div className="p-8 text-center text-white/30">
                                        <p>No results found for "{query}"</p>
                                    </div>
                                )}

                                {query && hasResults && (
                                    <div className="space-y-6 p-2">
                                        {/* Projects */}
                                        {filteredProjects.length > 0 && (
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-bold text-gold uppercase tracking-wider px-2">Projects</h3>
                                                {filteredProjects.map(p => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => handleNavigate(`/projects/${p.id}`)}
                                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-white/50 group-hover:text-gold transition-colors">
                                                            <Building size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium group-hover:text-gold transition-colors">{p.name}</p>
                                                            <p className="text-xs text-white/50">{p.location}</p>
                                                        </div>
                                                        <ChevronRight className="ml-auto text-white/20 w-4 h-4 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Builders */}
                                        {filteredBuilders.length > 0 && (
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-bold text-gold uppercase tracking-wider px-2">Builders</h3>
                                                {filteredBuilders.map(b => (
                                                    <button
                                                        key={b.id}
                                                        onClick={() => handleNavigate(`/partners`)} // Navigate to partners list for now, or specific builder page if available
                                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-white/50 group-hover:text-gold transition-colors">
                                                            <Briefcase size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium group-hover:text-gold transition-colors">{b.name}</p>
                                                            <p className="text-xs text-white/50">{b.total_projects} Projects</p>
                                                        </div>
                                                        <ChevronRight className="ml-auto text-white/20 w-4 h-4 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Resale */}
                                        {filteredResale.length > 0 && (
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-bold text-gold uppercase tracking-wider px-2">Resale</h3>
                                                {filteredResale.map(p => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => handleNavigate(`/resale`)}
                                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-white/50 group-hover:text-gold transition-colors">
                                                            <Key size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium group-hover:text-gold transition-colors">{p.title}</p>
                                                            <p className="text-xs text-white/50">{p.location}</p>
                                                        </div>
                                                        <ChevronRight className="ml-auto text-white/20 w-4 h-4 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Commercial */}
                                        {filteredCommercial.length > 0 && (
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-bold text-gold uppercase tracking-wider px-2">Commercial</h3>
                                                {filteredCommercial.map(p => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => handleNavigate(`/commercial`)}
                                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-white/50 group-hover:text-gold transition-colors">
                                                            <Building size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium group-hover:text-gold transition-colors">{p.title}</p>
                                                            <p className="text-xs text-white/50">{p.location}</p>
                                                        </div>
                                                        <ChevronRight className="ml-auto text-white/20 w-4 h-4 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Land */}
                                        {filteredLand.length > 0 && (
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-bold text-gold uppercase tracking-wider px-2">Lands</h3>
                                                {filteredLand.map(p => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => handleNavigate(`/lands`)}
                                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-white/50 group-hover:text-gold transition-colors">
                                                            <Trees size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium group-hover:text-gold transition-colors">{p.title}</p>
                                                            <p className="text-xs text-white/50">{p.location}</p>
                                                        </div>
                                                        <ChevronRight className="ml-auto text-white/20 w-4 h-4 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
