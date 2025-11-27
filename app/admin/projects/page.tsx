"use client";


import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdvancedFilter from "@/components/AdvancedFilter";
import { PlusCircle, Search, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        fetchProjects();
    }, [searchParams]);

    const fetchProjects = async () => {
        setLoading(true);

        // Parse filters from URL
        const search = searchParams.get("search") || "";
        const type = searchParams.get("type") || "";
        const status = searchParams.get("status") || "";
        const minPrice = Number(searchParams.get("minPrice")) || 0;
        const maxPrice = Number(searchParams.get("maxPrice")) || 1000000000;
        const bhk = searchParams.get("bhk")?.split(",") || [];

        let query = supabase
            .from("projects")
            .select("*") // Removed builders(name) join
            .order("id", { ascending: false });

        if (search) {
            query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);
        }

        if (type) {
            query = query.eq("type", type);
        }

        if (status) {
            query = query.eq("status", status);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching projects:", error);
        } else {
            let filtered = data || [];

            // Client-side Price Filter
            if (minPrice > 0 || maxPrice < 1000000000) {
                filtered = filtered.filter((p: any) => {
                    const parsePrice = (priceStr: string) => {
                        if (!priceStr) return 0;
                        const clean = priceStr.toLowerCase().replace(/,/g, "").replace(/\/ month/g, "");
                        if (clean.includes("cr")) return parseFloat(clean) * 10000000;
                        if (clean.includes("l")) return parseFloat(clean) * 100000;
                        if (clean.includes("k")) return parseFloat(clean) * 1000;
                        return parseFloat(clean) || 0;
                    };
                    const pValue = parsePrice(p.price);
                    return pValue >= minPrice && pValue <= maxPrice;
                });
            }

            // Client-side BHK Filter
            if (bhk.length > 0) {
                filtered = filtered.filter((p: any) => {
                    const text = `${p.configuration} ${p.description}`.toLowerCase();
                    return bhk.some(b => text.includes(`${b}bhk`) || text.includes(`${b} bhk`));
                });
            }

            setProjects(filtered);
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this project?")) {
            const { error } = await supabase.from("projects").delete().eq("id", id);
            if (error) {
                alert("Error deleting project");
            } else {
                fetchProjects();
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-dark-bg text-white font-sans">
            <AdminSidebar />

            <main className="flex-1 ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white">Projects</h1>
                        <p className="text-white/50">Manage your property listings.</p>
                    </div>
                    <Link
                        href="/admin/projects/new"
                        className="flex items-center gap-2 bg-gold text-dark-bg px-4 py-2 rounded-lg font-bold hover:bg-amber-400 transition-colors"
                    >
                        <PlusCircle size={20} />
                        Add New Property
                    </Link>
                </div>

                {/* Advanced Filter */}
                <div className="mb-8">
                    <AdvancedFilter className="max-w-full" />
                </div>

                <div className="bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-xs text-white/50 uppercase tracking-wider">
                                <th className="p-4">Property</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-white/40">Loading projects...</td>
                                </tr>
                            ) : projects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-white/40">No projects found matching your filters.</td>
                                </tr>
                            ) : (
                                projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{project.name}</div>
                                            <div className="text-xs text-white/40">{project.location}</div>
                                        </td>
                                        <td className="p-4 text-sm text-white/70">{project.type}</td>
                                        <td className="p-4 text-sm text-gold font-medium">{project.price}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs border ${project.status === 'Ready to Move'
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
                                                    <Eye size={16} />
                                                </button>
                                                <Link href={`/admin/projects/edit/${project.id}`} className="p-2 hover:bg-white/10 rounded-lg text-blue-400 hover:text-blue-300 transition-colors">
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
