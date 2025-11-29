"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import clsx from "clsx";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500/30 pt-24">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-24">
                    {/* --- Left Side: Info --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1"
                    >
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight">
                            Let's Talk <br />
                            <span className="text-amber-500">Real Estate</span>
                        </h1>
                        <p className="text-neutral-400 text-lg mb-12 max-w-md leading-relaxed">
                            Whether you're looking to buy, sell, or invest, our expert consultants are here to guide you through every step of your journey in Mangalore.
                        </p>

                        <div className="space-y-10">
                            {/* Partners */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 rounded-full bg-neutral-900 border border-amber-500/30 group-hover:border-amber-500 transition-colors">
                                        <Phone className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-500 uppercase tracking-wider mb-1">Partner</p>
                                        <h3 className="text-xl font-serif font-semibold text-white">Kishan</h3>
                                        <p className="text-neutral-300 font-mono mt-1">+91 81051 10248</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 rounded-full bg-neutral-900 border border-amber-500/30 group-hover:border-amber-500 transition-colors">
                                        <Phone className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-500 uppercase tracking-wider mb-1">Partner</p>
                                        <h3 className="text-xl font-serif font-semibold text-white">Prathvi Raj Jain</h3>
                                        <p className="text-neutral-300 font-mono mt-1">+91 98446 52026</p>
                                    </div>
                                </div>
                            </div>

                            {/* Office Info */}
                            <div className="pt-8 border-t border-white/10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <MapPin className="w-6 h-6 text-amber-500" />
                                    <p className="text-neutral-300">
                                        Empire Mall, MG Road, <br /> Mangalore, Karnataka 575003
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Mail className="w-6 h-6 text-amber-500" />
                                    <p className="text-neutral-300">hello@mangaloreproperties.com</p>
                                </div>
                            </div>

                            {/* WhatsApp Button */}
                            <a
                                href="https://wa.me/918105110248"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] mt-4"
                            >
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp Us
                            </a>
                        </div>
                    </motion.div>

                    {/* --- Right Side: Form --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex-1"
                    >
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
                            <h3 className="text-2xl font-serif font-semibold text-white mb-6">Send us a Message</h3>
                            <ContactForm />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- Map Section --- */}
            <div className="w-full h-[400px] grayscale invert filter">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.813009246696!2d74.8407783759363!3d12.871476987434785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a4c5d5c5c5d%3A0x5c5c5c5c5c5c5c5c!2sMangalore%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    );
}

function ContactForm() {
    const [formData, setFormData] = React.useState({
        name: "",
        phone: "",
        message: ""
    });
    const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = React.useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            // Dynamic import to avoid server-side issues if env vars are missing during build
            const { supabase } = await import("@/lib/supabase");

            const { error } = await supabase
                .from("leads")
                .insert([
                    {
                        name: formData.name,
                        phone: formData.phone,
                        message: formData.message,
                        created_at: new Date().toISOString(),
                    },
                ]);

            if (error) throw error;

            setStatus("success");
            setFormData({ name: "", phone: "", message: "" });
        } catch (error: any) {
            console.error("Error submitting form:", error);
            setStatus("error");
            setErrorMessage(error.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm text-neutral-400 mb-2">Your Name</label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="John Doe"
                />
            </div>
            <div>
                <label className="block text-sm text-neutral-400 mb-2">Phone Number</label>
                <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="+91 98765 43210"
                />
            </div>
            <div>
                <label className="block text-sm text-neutral-400 mb-2">Message</label>
                <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    placeholder="I'm interested in..."
                />
            </div>

            <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={clsx(
                    "w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg",
                    status === "success"
                        ? "bg-emerald-600 text-white cursor-default"
                        : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950"
                )}
            >
                {status === "loading" ? (
                    <span>Sending...</span>
                ) : status === "success" ? (
                    <span>Message Sent!</span>
                ) : (
                    <>
                        <Send className="w-5 h-5" />
                        Send Message
                    </>
                )}
            </button>

            {status === "success" && (
                <p className="text-emerald-500 text-center text-sm mt-2">
                    Thank you! Our agent will contact you shortly.
                </p>
            )}
            {status === "error" && (
                <p className="text-red-500 text-center text-sm mt-2">
                    {errorMessage}
                </p>
            )}
        </form>
    );
}
