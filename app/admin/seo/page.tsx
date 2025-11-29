"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Search, CheckCircle, AlertTriangle, XCircle, RefreshCw, Wand2, Loader2 } from "lucide-react";
import clsx from "clsx";
import { runAI } from "@/app/actions/ai-service";

type ProjectSEO = {
    id: number;
    title: string;
    description: string | null;
    cover_image_url: string | null;
    category: string;
    ai_local_insight: string | null;
};

export default function SEOToolsPage() {
    const [projects, setProjects] = useState<ProjectSEO[]>([]);
    const [loading, setLoading] = useState(true);
    const [generatingId, setGeneratingId] = useState<number | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("projects")
            .select("id, title:name, description, cover_image_url:image, category:type, ai_local_insight")
            .order("id", { ascending: false });

        if (error) {
            console.error("Error fetching projects:", error);
        } else {
            setProjects(data || []);
        }
        setLoading(false);
    };

    const calculateScore = (project: ProjectSEO) => {
        let score = 0;
        if (project.title && project.title.length >= 10) score += 20;
        if (project.description && project.description.length >= 50) score += 30;
        if (project.cover_image_url) score += 30;
        if (project.ai_local_insight) score += 20;
        return score;
    };

    const generateSEO = async (project: ProjectSEO) => {
        setGeneratingId(project.id);
        try {
            const input = `Title: ${project.title}\nCategory: ${project.category}`;
            const result = await runAI("seo", input);

            if (result && !result.error && result.meta_description) {
                // Update Supabase
                const { error } = await supabase
                    .from("projects")
                    .update({ description: result.meta_description })
                    .eq("id", project.id);

                if (error) throw error;

                // Update Local State
                setProjects(projects.map(p =>
                    p.id === project.id ? { ...p, description: result.meta_description } : p
                ));
            } else {
                alert("Failed to generate SEO content.");
            }
        } catch (error) {
            console.error("Error generating SEO:", error);
            alert("An error occurred.");
        } finally {
            setGeneratingId(null);
        }
    };

    return (
        <div className="flex min-h-screen bg-dark-bg text-white font-sans">
            <AdminSidebar />

            <main className="flex-1 ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white">SEO Tools</h1>
                        <p className="text-white/50">Optimize your property listings for search engines.</p>
                    </div>
                    <button
                        onClick={fetchProjects}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                <div className="bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-xs text-white/50 uppercase tracking-wider">
                                <th className="p-4">Project</th>
                                <th className="p-4">Health Score</th>
                                <th className="p-4">Issues</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-white/40">Loading...</td>
                                </tr>
                            ) : projects.map((project) => {
                                const score = calculateScore(project);
                                const issues = [];
                                if (!project.description || project.description.length < 50) issues.push("Short/Missing Description");
                                if (!project.cover_image_url) issues.push("Missing Cover Image");
                                if (!project.ai_local_insight) issues.push("Missing Local Insight");

                                return (
                                    <tr key={project.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{project.title}</div>
                                            <div className="text-xs text-white/40">#{project.id}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full max-w-[100px] h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={clsx(
                                                            "h-full rounded-full",
                                                            score >= 80 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"
                                                        )}
                                                        style={{ width: `${score}%` }}
                                                    />
                                                </div>
                                                <span className={clsx(
                                                    "text-sm font-bold",
                                                    score >= 80 ? "text-green-500" : score >= 50 ? "text-amber-500" : "text-red-500"
                                                )}>
                                                    {score}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {issues.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {issues.map((issue, i) => (
                                                        <span key={i} className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs border border-red-500/20">
                                                            {issue}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="flex items-center gap-1 text-green-500 text-sm">
                                                    <CheckCircle size={14} /> All Good
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => generateSEO(project)}
                                                disabled={generatingId === project.id}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                            >
                                                {generatingId === project.id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <Wand2 size={14} />
                                                )}
                                                Fix with AI
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
