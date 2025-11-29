"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface Inquiry {
    id: string;
    project: string;
    message: string;
    name: string;
    phone: string;
    email: string;
    created_at: string;
    status: string;
}

export default function MyInquiries() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch('/api/user/inquiries', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch inquiries');
            const data = await res.json();
            setInquiries(data.inquiries);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </div>
        );
    }

    if (inquiries.length === 0) {
        return (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                <MessageSquare className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No inquiries yet</h3>
                <p className="text-white/60">
                    Your property inquiries will appear here
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <p className="text-white/60 mb-4">
                {inquiries.length} inquir{inquiries.length === 1 ? 'y' : 'ies'} made
            </p>

            {inquiries.map((inquiry) => (
                <div
                    key={inquiry.id}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                >
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">{inquiry.project}</h3>
                            <p className="text-sm text-white/60">
                                {new Date(inquiry.created_at).toLocaleDateString()} at{' '}
                                {new Date(inquiry.created_at).toLocaleTimeString()}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${inquiry.status === 'responded'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-orange-500/20 text-orange-500'
                            }`}>
                            {inquiry.status}
                        </span>
                    </div>

                    {inquiry.message && (
                        <div className="bg-white/5 rounded-lg p-4 mb-4">
                            <p className="text-white/80 text-sm">{inquiry.message}</p>
                        </div>
                    )}

                    <div className="flex items-center gap-6 text-sm text-white/60">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Name:</span>
                            <span>{inquiry.name}</span>
                        </div>
                        {inquiry.phone && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Phone:</span>
                                <span>{inquiry.phone}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
