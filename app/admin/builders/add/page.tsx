"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Building } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function AddBuilderPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        website: "",
        contact_email: "",
        phone: "",
        year_est: "",
        address: ""
    });

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Supabase Storage (or ImageKit if preferred, using Supabase for now for simplicity if bucket exists)
        // For now, we'll assume we upload to a 'builders' bucket or similar.
        // If bucket doesn't exist, we might need to create it or use 'projects' bucket.
        // Let's try to upload to 'public' bucket if available or just store the file object to upload on submit.
        // Actually, let's implement the upload logic in handleSubmit to keep it clean.
        setFormData({ ...formData, logo_file: file } as any);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let logo_url = null;

            // Upload Logo if selected
            if ((formData as any).logo_file) {
                const file = (formData as any).logo_file;
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `builders/${fileName}`;

                // Using ImageKit would be better if configured, but let's try Supabase storage 'public' bucket first
                // Or we can use the existing uploadImage function if we import it, but that might be tied to ProjectForm.
                // Let's assume we can upload to 'projects' bucket for now as a fallback or 'builders' if we made it.
                // To be safe, let's use a public URL if we can't upload easily, OR use the ImageKit logic if available.

                // For this implementation, I'll skip the actual file upload implementation details here 
                // and assume we might just paste a URL or use a placeholder if upload fails, 
                // BUT the user wants "Real Builders", so I should probably implement real upload.

                // Let's try a direct Supabase upload to 'projects' bucket (since we know it exists)
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('projects')
                    .upload(filePath, file);

                if (uploadError) {
                    console.error("Upload error:", uploadError);
                    alert("Failed to upload logo. Please try again.");
                    setLoading(false);
                    return;
                }

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('projects')
                    .getPublicUrl(filePath);

                logo_url = publicUrl;
            }

            // Generate slug if empty
            const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            const { error } = await supabase
                .from("builders")
                .insert([{
                    name: formData.name,
                    slug,
                    description: formData.description,
                    website: formData.website,
                    contact_email: formData.contact_email,
                    phone: formData.phone,
                    year_est: formData.year_est ? parseInt(formData.year_est) : null,
                    address: formData.address,
                    logo_url
                }]);

            if (error) throw error;

            router.push("/admin/builders");
            router.refresh();

        } catch (error: any) {
            console.error("Error adding builder:", error);
            alert("Error adding builder: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Link href="/admin/builders" className="flex items-center gap-2 text-white/60 hover:text-white mb-6">
                <ArrowLeft size={20} />
                Back to Builders
            </Link>

            <h1 className="text-3xl font-serif font-bold text-white mb-8">Add New Builder</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Logo Upload */}
                <div className="glass-panel p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Builder Logo</h3>
                    <div className="flex items-center gap-6">
                        <div className="relative w-32 h-32 bg-white/5 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden group">
                            {logoPreview ? (
                                <Image src={logoPreview} alt="Preview" fill className="object-contain p-2" />
                            ) : (
                                <Building className="text-white/20" size={40} />
                            )}
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="text-white" size={24} />
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                        <div className="text-sm text-white/60">
                            <p>Upload high-resolution logo.</p>
                            <p>Recommended size: 500x500px</p>
                            <p>Formats: PNG, JPG, SVG</p>
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="glass-panel p-6 rounded-xl border border-white/10 space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Builder Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                                placeholder="e.g. Prestige Group"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Slug (Optional)</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                                placeholder="prestige-group"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Description</label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                            placeholder="About the builder..."
                        />
                    </div>
                </div>

                {/* Contact & Details */}
                <div className="glass-panel p-6 rounded-xl border border-white/10 space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4">Contact & Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Website</label>
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Year Established</label>
                            <input
                                type="number"
                                value={formData.year_est}
                                onChange={(e) => setFormData({ ...formData, year_est: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                                placeholder="e.g. 1986"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Contact Email</label>
                            <input
                                type="email"
                                value={formData.contact_email}
                                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                                placeholder="contact@builder.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                                placeholder="+91..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Head Office Address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                            placeholder="Full address..."
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link
                        href="/admin/builders"
                        className="px-6 py-3 rounded-lg font-bold text-white/60 hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gold text-dark-bg px-8 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Builder"}
                    </button>
                </div>
            </form>
        </div>
    );
}
