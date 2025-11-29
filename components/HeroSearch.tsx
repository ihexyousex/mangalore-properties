"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import GlobalSearch from "./GlobalSearch";

export default function HeroSearch() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            <div
                onClick={() => setIsSearchOpen(true)}
                className="w-full max-w-xl mx-auto mt-8 relative group cursor-pointer"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-amber-500/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-50" />
                <div className="relative flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-4 transition-all duration-300 group-hover:bg-white/15 group-hover:border-gold/50 group-hover:scale-[1.02]">
                    <Search className="text-gold w-6 h-6" />
                    <span className="text-white/60 text-lg font-medium group-hover:text-white/80 transition-colors">
                        Search for projects, locations...
                    </span>
                    <div className="ml-auto bg-white/10 rounded-lg px-2 py-1">
                        <span className="text-xs text-white/40 font-mono">⌘K</span>
                    </div>
                </div>
            </div>
        </>
    );
}
