"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useUser } from "./UserProvider";


export default function CompareBar() {
    const { compareList, toggleCompare } = useUser();

    if (compareList.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 animate-in slide-in-from-bottom duration-300">
            <div className="container mx-auto max-w-3xl">
                <div className="bg-[#1a1a1a] border border-gold/30 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-gold text-dark-bg font-bold px-3 py-1 rounded-full text-sm">
                            {compareList.length} Selected
                        </div>
                        <p className="text-white/70 text-sm hidden sm:block">
                            Compare up to 3 projects
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => compareList.forEach(id => toggleCompare(id))}
                            className="text-white/50 hover:text-white text-sm underline px-2"
                        >
                            Clear
                        </button>
                        <Link
                            href="/compare"
                            className="bg-gold text-dark-bg font-bold px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-500 transition-colors"
                        >
                            Compare Now
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
