"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, ExternalLink, Building } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminBuildersPage() {
    const [builders, setBuilders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBuilders();
    }, []);

    const fetchBuilders = async () => {
        try {
            const { data, error } = await supabase
                .from("builders")
                .select("*")
                .order("name");

            if (error) throw error;
            setBuilders(data || []);
        } catch (error) {
            console.error("Error fetching builders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this builder?")) return;

        try {
            const { error } = await supabase
                .from("builders")
                .delete()
                .eq("id", id);

            if (error) throw error;
            fetchBuilders(); // Refresh list
        } catch (error) {
            alert("Error deleting builder");
            console.error(error);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Builders</h1>
                    <p className="text-white/60">Manage real estate developers and partners</p>
                </div>
                <Link
                    href="/admin/builders/add"
                    className="flex items-center gap-2 bg-gold text-dark-bg px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
                >
                    <Plus size={20} />
                    Add Builder
                </Link>
            </div>

            {loading ? (
                <div className="text-white">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {builders.map((builder) => (
                        <div key={builder.id} className="glass-panel p-6 rounded-xl border border-white/10 group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="relative w-16 h-16 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                                    {builder.logo_url ? (
                                        <Image
                                            src={builder.logo_url}
                                            alt={builder.name}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/20">
                                            <Building size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDelete(builder.id)}
                                        className="p-2 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{builder.name}</h3>
                            <p className="text-white/60 text-sm line-clamp-2 mb-4">
                                {builder.description || "No description provided."}
                            </p>

                            <div className="flex flex-wrap gap-2 text-xs text-white/40">
                                {builder.website && (
                                    <a
                                        href={builder.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:text-gold transition-colors"
                                    >
                                        <ExternalLink size={12} />
                                        Website
                                    </a>
                                )}
                                {builder.year_est && (
                                    <span>• Est. {builder.year_est}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
