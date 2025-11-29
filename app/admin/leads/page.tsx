"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Search, Mail, Phone, Calendar } from "lucide-react";

type Lead = {
    id: string;
    created_at: string;
    name: string;
    phone: string;
    email: string | null;
    project: string | null;
    message: string | null;
};

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("leads")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching leads:", error);
        } else {
            setLeads(data || []);
        }
        setLoading(false);
    };

    const filteredLeads = leads.filter((lead) =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        (lead.project && lead.project.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex min-h-screen bg-dark-bg text-white font-sans">
            <AdminSidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white">Leads</h1>
                        <p className="text-white/50">Manage inquiries and potential clients</p>
                    </div>
                    <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                        <span className="text-gold font-bold">{leads.length}</span> Total Leads
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <input
                        type="text"
                        placeholder="Search leads by name, phone, or project..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-neutral-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:border-gold/50 focus:outline-none transition-all"
                    />
                </div>

                {/* Leads List */}
                <div className="bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-white/50">Loading leads...</div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-12 text-center text-white/40">
                            No leads found matching your search.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 text-xs text-white/40 uppercase border-b border-white/10">
                                        <th className="px-6 py-4 font-medium">Date</th>
                                        <th className="px-6 py-4 font-medium">Name</th>
                                        <th className="px-6 py-4 font-medium">Contact</th>
                                        <th className="px-6 py-4 font-medium">Interest</th>
                                        <th className="px-6 py-4 font-medium">Message</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredLeads.map((lead) => (
                                        <tr key={lead.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-white/60 text-sm whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    {new Date(lead.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-white/30 pl-6">
                                                    {new Date(lead.created_at).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-white/80 hover:text-gold transition-colors">
                                                        <Phone size={14} />
                                                        {lead.phone}
                                                    </a>
                                                    {lead.email && (
                                                        <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors">
                                                            <Mail size={12} />
                                                            {lead.email}
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-2 py-1 bg-gold/10 text-gold rounded text-xs font-medium">
                                                    {lead.project || "General Inquiry"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-white/60 max-w-xs truncate" title={lead.message || ""}>
                                                {lead.message || "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
