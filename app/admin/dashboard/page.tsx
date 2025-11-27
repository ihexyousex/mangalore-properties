"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { RefreshCw, TrendingUp, Users, Building, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import clsx from "clsx";

type Lead = {
    id: string;
    created_at: string;
    name: string;
    phone: string;
    project: string | null;
};

type Project = {
    id: number;
    status: string;
    category: string;
};

export default function AdminDashboardPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [adminName, setAdminName] = useState("Admin");
    const router = useRouter();

    useEffect(() => {
        const isAuth = localStorage.getItem("admin_auth");
        if (!isAuth) {
            router.push("/admin/login");
            return;
        }
        setAdminName(localStorage.getItem("admin_name") || "Admin");
        fetchData();
    }, [router]);

    const fetchData = async () => {
        setLoading(true);

        // Fetch Leads
        const { data: leadsData } = await supabase
            .from("leads")
            .select("id, created_at, name, phone, project")
            .order("created_at", { ascending: false });

        // Fetch Projects
        const { data: projectsData } = await supabase
            .from("projects")
            .select("id, status, type, category:type"); // Alias type as category for easier usage

        setLeads(leadsData || []);
        // Map 'type' to 'category' if alias doesn't work as expected in client types
        setProjects(projectsData?.map((p: any) => ({ ...p, category: p.type })) || []);
        setLoading(false);
    };

    // Calculate Stats
    const totalProperties = projects.length;
    const activeLeads = leads.length;
    const totalViews = 12450; // Mock data for now
    const seoScore = 85; // Mock data

    const recentLeads = leads.slice(0, 5);

    return (
        <div className="flex min-h-screen bg-dark-bg text-white font-sans">
            <AdminSidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white">Dashboard</h1>
                        <p className="text-white/50">Welcome back, {adminName}</p>
                    </div>
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh Data
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Properties"
                        value={totalProperties}
                        icon={Building}
                        trend="+2 this week"
                        trendUp={true}
                    />
                    <StatsCard
                        title="Active Leads"
                        value={activeLeads}
                        icon={Users}
                        trend="+5 today"
                        trendUp={true}
                    />
                    <StatsCard
                        title="Page Views"
                        value={totalViews.toLocaleString()}
                        icon={TrendingUp}
                        trend="+12% vs last month"
                        trendUp={true}
                    />
                    <StatsCard
                        title="SEO Health"
                        value={`${seoScore}%`}
                        icon={Search}
                        trend="Good"
                        trendUp={true}
                        isScore
                    />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Leads */}
                    <div className="lg:col-span-2 bg-neutral-900/50 border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Recent Leads</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs text-white/40 uppercase border-b border-white/5">
                                        <th className="pb-3 pl-2">Name</th>
                                        <th className="pb-3">Project</th>
                                        <th className="pb-3">Date</th>
                                        <th className="pb-3 text-right pr-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {recentLeads.map((lead) => (
                                        <tr key={lead.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-3 pl-2">
                                                <div className="font-medium text-white">{lead.name}</div>
                                                <div className="text-xs text-white/40">{lead.phone}</div>
                                            </td>
                                            <td className="py-3 text-sm text-gold">
                                                {lead.project || "General Inquiry"}
                                            </td>
                                            <td className="py-3 text-sm text-white/60">
                                                {new Date(lead.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 text-right pr-2">
                                                <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentLeads.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-white/40">
                                                No leads found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-center">
                            <button onClick={() => router.push('/admin/leads')} className="text-sm text-gold hover:underline">
                                View All Leads
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions / Distribution */}
                    <div className="space-y-6">
                        {/* Property Distribution */}
                        <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Property Distribution</h2>
                            <div className="space-y-4">
                                <DistributionBar
                                    label="Residential"
                                    count={projects.filter(p => p.category === 'Residential').length}
                                    total={totalProperties}
                                    color="bg-blue-500"
                                />
                                <DistributionBar
                                    label="Commercial"
                                    count={projects.filter(p => p.category === 'Commercial').length}
                                    total={totalProperties}
                                    color="bg-purple-500"
                                />
                                <DistributionBar
                                    label="Rent"
                                    count={projects.filter(p => p.category === 'Rent').length}
                                    total={totalProperties}
                                    color="bg-green-500"
                                />
                                <DistributionBar
                                    label="Land"
                                    count={projects.filter(p => p.category === 'Land').length}
                                    total={totalProperties}
                                    color="bg-amber-500"
                                />
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-gold/20 to-neutral-900 border border-gold/20 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-2">Quick Actions</h2>
                            <p className="text-sm text-white/60 mb-4">Manage your inventory efficiently.</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => router.push('/admin/projects/add')}
                                    className="p-3 bg-gold text-black font-bold rounded-lg hover:bg-amber-400 transition-colors text-sm"
                                >
                                    + Add Property
                                </button>
                                <button
                                    onClick={() => router.push('/admin/partners')}
                                    className="p-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors text-sm"
                                >
                                    Manage Builders
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, trend, trendUp, isScore = false }: any) {
    return (
        <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 hover:border-gold/30 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className={clsx("p-3 rounded-lg", isScore ? "bg-purple-500/10 text-purple-400" : "bg-gold/10 text-gold")}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={clsx("flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full", trendUp ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
                        {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {trend}
                    </div>
                )}
            </div>
            <h3 className="text-white/50 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-white group-hover:text-gold transition-colors">{value}</p>
        </div>
    );
}

function DistributionBar({ label, count, total, color }: any) {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-white/70">{label}</span>
                <span className="text-white font-medium">{count} ({percentage}%)</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className={clsx("h-full rounded-full transition-all duration-1000", color)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
