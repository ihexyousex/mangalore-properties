"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import clsx from "clsx";

const faqs = [
    {
        question: "Who are the top real estate builders in Mangalore?",
        answer: (
            <>
                Mangalore is home to premium developers like <span className="text-gold font-bold">NorthernSky Properties</span>, <span className="text-gold font-bold">Land Trades</span>, <span className="text-gold font-bold">Prestige Group</span>, and <span className="text-gold font-bold">Raheja Universal</span>. We host their latest luxury projects and resale inventory.
            </>
        )
    },
    {
        question: "What are the best residential areas in Mangalore?",
        answer: (
            <>
                Prime locations for investment include <span className="text-gold font-bold">Kadri</span>, <span className="text-gold font-bold">Bejai</span>, <span className="text-gold font-bold">Pumpwell</span>, and <span className="text-gold font-bold">Falnir</span>. These areas offer high appreciation and proximity to schools and malls.
            </>
        )
    },
    {
        question: "Do you deal with luxury apartments and villas?",
        answer: (
            <>
                Yes, we specialize in high-end properties ranging from <span className="text-gold font-bold">₹65 Lakhs</span> to <span className="text-gold font-bold">₹5 Crores</span>, including sea-view apartments and gated communities.
            </>
        )
    }
];

export default function SeoFaq() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="bg-neutral-950 py-24 border-t border-white/5">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                        FAQ & <span className="text-gold">Insights</span>
                    </h2>
                    <p className="text-white/60">
                        Common questions about buying real estate in Mangalore.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-white/10 rounded-xl overflow-hidden bg-white/5 hover:border-gold/30 transition-colors"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="text-lg font-bold text-white pr-8">
                                    {faq.question}
                                </span>
                                <div className={clsx(
                                    "p-2 rounded-full bg-white/5 text-gold transition-transform duration-300",
                                    openIndex === index ? "rotate-180 bg-gold text-dark-bg" : ""
                                )}>
                                    {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-neutral-400 leading-relaxed border-t border-white/5 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
