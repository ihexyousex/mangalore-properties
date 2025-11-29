"use client";

import { useState } from "react";
import { Camera, Edit2 } from "lucide-react";
import Image from "next/image";
import EditProfileModal from "./EditProfileModal";
import { supabase } from "@/lib/supabaseClient";

interface ProfileHeaderProps {
    profile: {
        id: string;
        email: string;
        full_name: string;
        phone: string;
        avatar_url: string;
        bio: string;
        location: string;
        stats: {
            total_submissions: number;
            approved_submissions: number;
            pending_submissions: number;
            total_favorites: number;
            total_inquiries: number;
        };
    };
    onUpdate: () => void;
}

export default function ProfileHeader({ profile, onUpdate }: ProfileHeaderProps) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingAvatar(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch('/api/user/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to upload avatar');

            onUpdate(); // Refresh profile
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Failed to upload avatar');
        } finally {
            setUploadingAvatar(false);
        }
    };

    return (
        <>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-white/10 border-2 border-yellow-500/50">
                            {profile.avatar_url ? (
                                <Image
                                    src={profile.avatar_url}
                                    alt={profile.full_name || 'Profile'}
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-yellow-500">
                                    {profile.full_name?.charAt(0) || profile.email?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>

                        {/* Upload Button */}
                        <label className="absolute bottom-0 right-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-400 transition-colors">
                            <Camera className="w-5 h-5 text-neutral-950" />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                                disabled={uploadingAvatar}
                            />
                        </label>

                        {uploadingAvatar && (
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    {profile.full_name || 'User'}
                                </h1>
                                <p className="text-white/60 mt-1">{profile.email}</p>
                                {profile.phone && (
                                    <p className="text-white/60 mt-0.5">{profile.phone}</p>
                                )}
                                {profile.location && (
                                    <p className="text-white/60 mt-0.5">📍 {profile.location}</p>
                                )}
                                {profile.bio && (
                                    <p className="text-white/80 mt-2 max-w-2xl">{profile.bio}</p>
                                )}
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                <span className="hidden md:inline">Edit Profile</span>
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                            <div className="text-center p-3 bg-white/5 rounded-lg">
                                <div className="text-2xl font-bold text-yellow-500">
                                    {profile.stats.total_submissions}
                                </div>
                                <div className="text-sm text-white/60 mt-1">Submissions</div>
                            </div>
                            <div className="text-center p-3 bg-white/5 rounded-lg">
                                <div className="text-2xl font-bold text-green-500">
                                    {profile.stats.approved_submissions}
                                </div>
                                <div className="text-sm text-white/60 mt-1">Approved</div>
                            </div>
                            <div className="text-center p-3 bg-white/5 rounded-lg">
                                <div className="text-2xl font-bold text-orange-500">
                                    {profile.stats.pending_submissions}
                                </div>
                                <div className="text-sm text-white/60 mt-1">Pending</div>
                            </div>
                            <div className="text-center p-3 bg-white/5 rounded-lg">
                                <div className="text-2xl font-bold text-red-500">
                                    {profile.stats.total_favorites}
                                </div>
                                <div className="text-sm text-white/60 mt-1">Saved</div>
                            </div>
                            <div className="text-center p-3 bg-white/5 rounded-lg">
                                <div className="text-2xl font-bold text-blue-500">
                                    {profile.stats.total_inquiries}
                                </div>
                                <div className="text-sm text-white/60 mt-1">Inquiries</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={() => {
                        onUpdate();
                        setShowEditModal(false);
                    }}
                />
            )}
        </>
    );
}
