"use client";

import { useState } from "react";
import { Loader2, Save, User, Phone, MapPin, FileText } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface SettingsTabProps {
    profile: {
        full_name: string;
        phone: string;
        bio: string;
        location: string;
        email_notifications: boolean;
        whatsapp_notifications: boolean;
    };
    onUpdate: () => void;
}

export default function SettingsTab({ profile, onUpdate }: SettingsTabProps) {
    const [formData, setFormData] = useState({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        location: profile.location || '',
        email_notifications: profile.email_notifications ?? true,
        whatsapp_notifications: profile.whatsapp_notifications ?? true,
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to update profile');

            alert('Profile updated successfully!');
            onUpdate();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4" />
                                    Full Name
                                </div>
                            </label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <Phone className="w-4 h-4" />
                                    Phone Number
                                </div>
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-4 h-4" />
                                    Location
                                </div>
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                placeholder="Mangalore, Karnataka"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4" />
                                    Bio
                                </div>
                            </label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all resize-none"
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>

                    <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                            <div>
                                <p className="font-medium text-white">Email Notifications</p>
                                <p className="text-sm text-white/60">Receive updates about your submissions and inquiries</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.email_notifications}
                                onChange={(e) => setFormData({ ...formData, email_notifications: e.target.checked })}
                                className="w-5 h-5 rounded bg-white/10 border-white/20 text-yellow-500 focus:ring-yellow-500"
                            />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                            <div>
                                <p className="font-medium text-white">WhatsApp Notifications</p>
                                <p className="text-sm text-white/60">Get instant updates on WhatsApp</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.whatsapp_notifications}
                                onChange={(e) => setFormData({ ...formData, whatsapp_notifications: e.target.checked })}
                                className="w-5 h-5 rounded bg-white/10 border-white/20 text-yellow-500 focus:ring-yellow-500"
                            />
                        </label>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full md:w-auto px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Changes
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
