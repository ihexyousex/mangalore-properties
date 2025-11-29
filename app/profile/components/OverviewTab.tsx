"use client";

import { TrendingUp, FileText, Heart, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";

interface OverviewTabProps {
    profile: {
        stats: {
            total_submissions: number;
            approved_submissions: number;
            pending_submissions: number;
            total_favorites: number;
            total_inquiries: number;
        };
    };
}

export default function OverviewTab({ profile }: OverviewTabProps) {
    const statCards = [
        {
            icon: FileText,
            label: "Total Submissions",
            value: profile.stats.total_submissions,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
        },
        {
            icon: TrendingUp,
            label: "Approved",
            value: profile.stats.approved_submissions,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            icon: Heart,
            label: "Saved Properties",
            value: profile.stats.total_favorites,
            color: "text-red-500",
            bg: "bg-red-500/10",
        },
        {
            icon: MessageSquare,
            label: "Inquiries Made",
            value: profile.stats.total_inquiries,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-sm text-white/60">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href="/list-property"
                        className="flex items-center gap-3 p-4 bg-yellow-500 hover:bg-yellow-400 rounded-lg transition-colors group"
                    >
                        <div className="w-10 h-10 bg-neutral-950 rounded-lg flex items-center justify-center">
                            <Plus className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                            <p className="font-bold text-neutral-950">List New Property</p>
                            <p className="text-sm text-neutral-950/80">Submit a property for approval</p>
                        </div>
                    </Link>

                    <Link
                        href="/projects"
                        className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
                    >
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                            <Heart className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="font-bold text-white">Browse Properties</p>
                            <p className="text-sm text-white/60">Find your dream property</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Activity Summary */}
            {profile.stats.pending_submissions > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                You have {profile.stats.pending_submissions} pending submission{profile.stats.pending_submissions > 1 ? 's' : ''}
                            </h3>
                            <p className="text-white/60 mt-1">
                                Your properties are being reviewed by our team. We'll notify you once they're approved.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
