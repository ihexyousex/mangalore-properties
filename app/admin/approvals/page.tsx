"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface PendingSubmission {
    id: number;
    name: string;
    location: string;
    price: string;
    approval_status: string;
    submitted_at: string;
    cover_image_url: string;
    listing_type: string;
    property_meta: {
        submitter_name: string;
        submitter_email: string;
        submitter_phone: string;
        description?: string;
    };
}

export default function ApprovalsPage() {
    const [submissions, setSubmissions] = useState<PendingSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [actioningId, setActioningId] = useState<number | null>(null);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        fetchSubmissions();
    }, [filter]);

    const fetchSubmissions = async () => {
        try {
            const res = await fetch(`/api/admin/approvals?status=${filter}`);
            if (!res.ok) throw new Error('Failed to fetch submissions');
            const data = await res.json();
            setSubmissions(data.submissions);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            toast.error('Failed to load submissions');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        if (!confirm('Approve this property listing?')) return;

        setActioningId(id);
        try {
            const res = await fetch('/api/admin/approve-property', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: id }),
            });

            if (!res.ok) throw new Error('Failed to approve');

            toast.success('Property approved successfully!');
            fetchSubmissions(); // Refresh list
        } catch (error) {
            toast.error('Failed to approve property');
        } finally {
            setActioningId(null);
        }
    };

    const handleReject = async (id: number) => {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }

        setActioningId(id);
        try {
            const res = await fetch('/api/admin/reject-property', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: id, reason: rejectionReason }),
            });

            if (!res.ok) throw new Error('Failed to reject');

            toast.success('Property rejected');
            setRejectingId(null);
            setRejectionReason("");
            fetchSubmissions(); // Refresh list
        } catch (error) {
            toast.error('Failed to reject property');
        } finally {
            setActioningId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Property Approvals</h1>
                    <p className="text-white/60 mt-1">Review and manage property submissions</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status as any)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === status
                                ? 'bg-yellow-500 text-neutral-950'
                                : 'bg-white/10 text-white/60 hover:bg-white/20'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {/* Submissions Grid */}
            {submissions.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl">
                    <Clock className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No submissions found</h3>
                    <p className="text-white/60">
                        {filter === 'pending' ? 'No pending submissions' : `No ${filter} submissions`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {submissions.map((submission) => (
                        <div
                            key={submission.id}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden"
                        >
                            {/* Image */}
                            <div className="relative h-48 bg-white/10">
                                {submission.cover_image_url ? (
                                    <Image
                                        src={submission.cover_image_url}
                                        alt={submission.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/40">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    {submission.approval_status === 'pending' && (
                                        <span className="px-3 py-1 bg-orange-500/90 text-white rounded-full text-sm font-medium">
                                            Pending Review
                                        </span>
                                    )}
                                    {submission.approval_status === 'approved' && (
                                        <span className="px-3 py-1 bg-green-500/90 text-white rounded-full text-sm font-medium">
                                            Approved
                                        </span>
                                    )}
                                    {submission.approval_status === 'rejected' && (
                                        <span className="px-3 py-1 bg-red-500/90 text-white rounded-full text-sm font-medium">
                                            Rejected
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{submission.name}</h3>
                                    <p className="text-white/60 text-sm mb-1">📍 {submission.location}</p>
                                    <p className="text-yellow-500 font-bold text-lg">{submission.price}</p>
                                    <p className="text-white/40 text-xs mt-2">{submission.listing_type}</p>
                                </div>

                                {/* Submitter Info */}
                                <div className="bg-white/5 rounded-lg p-4">
                                    <p className="text-xs text-white/40 mb-2">Submitted by:</p>
                                    <p className="text-white font-medium">{submission.property_meta?.submitter_name}</p>
                                    <p className="text-white/60 text-sm">{submission.property_meta?.submitter_email}</p>
                                    <p className="text-white/60 text-sm">{submission.property_meta?.submitter_phone}</p>
                                    <p className="text-white/40 text-xs mt-2">
                                        {new Date(submission.submitted_at).toLocaleString()}
                                    </p>
                                </div>

                                {/* Description */}
                                {submission.property_meta?.description && (
                                    <div className="text-sm text-white/80 line-clamp-3">
                                        {submission.property_meta.description}
                                    </div>
                                )}

                                {/* Actions */}
                                {submission.approval_status === 'pending' && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleApprove(submission.id)}
                                            disabled={actioningId === submission.id}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {actioningId === submission.id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-5 h-5" />
                                                    Approve
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setRejectingId(submission.id)}
                                            disabled={actioningId === submission.id}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            <XCircle className="w-5 h-5" />
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Rejection Modal */}
            {rejectingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Reject Property</h2>
                        <p className="text-white/60 mb-4">Please provide a reason for rejection:</p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none resize-none"
                            placeholder="e.g., Incomplete information, Invalid pricing, etc."
                        />
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setRejectingId(null);
                                    setRejectionReason("");
                                }}
                                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(rejectingId)}
                                disabled={!rejectionReason.trim() || actioningId === rejectingId}
                                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {actioningId === rejectingId ? 'Rejecting...' : 'Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
