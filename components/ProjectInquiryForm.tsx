"use client";

import { useState } from "react";
import clsx from "clsx";

export default function ProjectInquiryForm({ project }: { project: any }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: ""
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const { supabase } = await import("@/lib/supabaseClient");

            const { error } = await supabase
                .from("leads")
                .insert([
                    {
                        name: formData.name,
                        phone: formData.phone,
                        message: `Interested in ${project.name} (Site Visit Request)`,
                        property_id: project.id.toString(),
                        builder_name: project.builder,
                        created_at: new Date().toISOString(),
                    },
                ]);

            if (error) throw error;

            setStatus("success");
            setFormData({ name: "", phone: "" });
        } catch (error: any) {
            console.error("Error submitting form:", error);
            setStatus("error");
            setErrorMessage(error.message || "Something went wrong.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                required
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold/50 outline-none transition-colors"
            />
            <input
                type="tel"
                required
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold/50 outline-none transition-colors"
            />
            <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={clsx(
                    "w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2",
                    status === "success"
                        ? "bg-emerald-600 text-white cursor-default"
                        : "bg-gold text-dark-bg hover:bg-yellow-500"
                )}
            >
                {status === "loading" ? (
                    <span>Sending...</span>
                ) : status === "success" ? (
                    <span>Request Sent!</span>
                ) : (
                    <span>Schedule Site Visit</span>
                )}
            </button>
            {status === "success" && (
                <p className="text-emerald-500 text-center text-xs mt-2">
                    Thank you! We will contact you shortly.
                </p>
            )}
            {status === "error" && (
                <p className="text-red-500 text-center text-xs mt-2">
                    {errorMessage}
                </p>
            )}
        </form>
    );
}
