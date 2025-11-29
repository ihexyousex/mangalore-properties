"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle, Clock, XCircle, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Submission {
    id: number;
    title: string;
    location: string;
    price: string;
    approval_status: string;
    submitted_at: string;
    rejection_reason?: string;
    cover_image_url: string;
    type: string;
}

export default function MySubmissions() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        fetchSubmissions();
    }, [filter]);

    const fetchSubmissions = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch(`/api/user/submissions?status=${filter}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch submissions');
            const data = await res.json();
            setSubmissions(data.submissions);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Approved
                    </span>
                );
            case 'pending':
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-orange-500/20 text-orange-500 rounded-full text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        Pending
                    </span>
                );
            case 'rejected':
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-sm font-medium">
                        <XCircle className="w-4 h-4" />
                        Rejected
                    </span>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-white/60" />
                    <span className="text-white/80">Filter:</span>
                </div>
                <div className="flex gap-2">
                    {['all', 'approved', 'pending', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === status
                                ? 'bg-yellow-500 text-neutral-950'
                                : 'bg-white/10 text-white/60 hover:bg-white/20'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Submissions Grid */}
            {submissions.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                    <AlertCircle className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No submissions found</h3>
                    <p className="text-white/60 mb-6">
                        {filter === 'all'
                            ? "You haven't submitted any properties yet"
                            : `You have no ${filter} submissions`}
                    </p>
                    <Link
                        href="/list-property"
                        className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-bold rounded-lg transition-colors"
                    >
                        List Your First Property
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {submissions.map((submission) => (
                        <div
                            key={submission.id}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all"
                        >
                            {/* Image */}
                            <div className="relative h-48 bg-white/10">
                                {submission.cover_image_url ? (
                                    <Image
                                        src={submission.cover_image_url}
                                        alt={submission.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/40">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    {getStatusBadge(submission.approval_status)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-white mb-2 truncate">
                                    {submission.title}
                                </h3>
                                <p className="text-white/60 text-sm mb-2">📍 {submission.location}</p>
                                <p className="text-yellow-500 font-bold mb-3">{submission.price}</p>

                                <div className="flex items-center justify-between text-xs text-white/40">
                                    <span>{submission.type}</span>
                                    <span>{new Date(submission.submitted_at).toLocaleDateString()}</span>
                                </div>

                                {/* Rejection Reason */}
                                {submission.approval_status === 'rejected' && submission.rejection_reason && (
                                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <p className="text-sm text-red-400">
                                            <strong>Reason:</strong> {submission.rejection_reason}
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                {submission.approval_status === 'approved' && (
                                    <Link
                                        href={`/projects/${submission.id}`}
                                        className="mt-4 block w-full text-center px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-medium rounded-lg transition-colors"
                                    >
                                        View Live
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
