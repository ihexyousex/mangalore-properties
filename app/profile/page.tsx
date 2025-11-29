"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/components/UserProvider";
import { useRouter } from "next/navigation";
import { Loader2, User, Heart, FileText, MessageSquare, Settings } from "lucide-react";
import ProfileHeader from "./components/ProfileHeader";
import OverviewTab from "./components/OverviewTab";
import MySubmissions from "./components/MySubmissions";
import SavedProperties from "./components/SavedProperties";
import MyInquiries from "./components/MyInquiries";
import SettingsTab from "./components/SettingsTab";

type TabType = 'overview' | 'submissions' | 'saved' | 'inquiries' | 'settings';

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    avatar_url: string;
    bio: string;
    location: string;
    email_notifications: boolean;
    whatsapp_notifications: boolean;
    stats: {
        total_submissions: number;
        approved_submissions: number;
        pending_submissions: number;
        rejected_submissions: number;
        total_favorites: number;
        total_inquiries: number;
    };
}

export default function ProfilePage() {
    const { user, openLoginModal } = useUser();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirect if not logged in
        if (!user) {
            openLoginModal();
            router.push('/');
            return;
        }

        fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            if (!res.ok) throw new Error('Failed to fetch profile');
            const data = await res.json();
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white gap-4">
                <p className="text-red-500 text-xl">Failed to load profile</p>
                <p className="text-white/50 text-sm">Please try logging in again.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'submissions', label: 'My Submissions', icon: FileText },
        { id: 'saved', label: 'Saved Properties', icon: Heart },
        { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
        { id: 'settings', label: 'Settings', icon: Settings },
    ] as const;

    return (
        <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Profile Header */}
                <ProfileHeader profile={profile} onUpdate={fetchProfile} />

                {/* Tabs */}
                <div className="mt-8 border-b border-white/10">
                    <div className="flex gap-1 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    flex items-center gap-2 px-6 py-3 font-medium transition-all whitespace-nowrap
                    ${activeTab === tab.id
                                            ? 'text-yellow-500 border-b-2 border-yellow-500'
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }
                  `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mt-8">
                    {activeTab === 'overview' && <OverviewTab profile={profile} />}
                    {activeTab === 'submissions' && <MySubmissions />}
                    {activeTab === 'saved' && <SavedProperties />}
                    {activeTab === 'inquiries' && <MyInquiries />}
                    {activeTab === 'settings' && (
                        <SettingsTab profile={profile} onUpdate={fetchProfile} />
                    )}
                </div>
            </div>
        </div>
    );
}
