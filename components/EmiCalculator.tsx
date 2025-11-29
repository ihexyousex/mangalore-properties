"use client";

import React, { useState, useEffect } from "react";
import { Calculator, MessageCircle } from "lucide-react";

interface EmiCalculatorProps {
    price?: number; // Price in Rupees
    projectName?: string;
}

export default function EmiCalculator({ price = 5000000, projectName = "Property" }: EmiCalculatorProps) {
    // Default to 80% of property price, or 50L if not provided
    const defaultLoan = price ? Math.round(price * 0.8) : 5000000;

    const [loanAmount, setLoanAmount] = useState(defaultLoan);
    const [interestRate, setInterestRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);
    const [emi, setEmi] = useState(0);

    useEffect(() => {
        // E = P * r * (1 + r)^n / ((1 + r)^n - 1)
        const P = loanAmount;
        const r = interestRate / 12 / 100;
        const n = tenure * 12;

        const calculatedEmi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        setEmi(Math.round(calculatedEmi));
    }, [loanAmount, interestRate, tenure]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatLakhs = (amount: number) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)} Cr`;
        }
        return `₹${(amount / 100000).toFixed(0)} L`;
    };

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
        `Hi, I need help with a Home Loan for ${projectName}. Loan Amount: ${formatLakhs(loanAmount)}`
    )}`;

    return (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
                <Calculator size={20} className="text-gold" />
                Smart EMI Calculator
            </h3>

            <div className="space-y-6">
                {/* Loan Amount */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-white/60">Loan Amount</span>
                        <span className="font-bold text-gold">{formatLakhs(loanAmount)}</span>
                    </div>
                    <input
                        type="range"
                        min="1000000"
                        max="50000000"
                        step="100000"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
                    />
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-white/60">Interest Rate</span>
                        <span className="font-bold text-gold">{interestRate}%</span>
                    </div>
                    <input
                        type="range"
                        min="6"
                        max="12"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
                    />
                </div>

                {/* Tenure */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-white/60">Tenure</span>
                        <span className="font-bold text-gold">{tenure} Years</span>
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="30"
                        step="1"
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
                    />
                </div>

                {/* Result */}
                <div className="pt-4 border-t border-white/10 text-center">
                    <p className="text-white/60 text-sm mb-1">Monthly EMI</p>
                    <p className="text-3xl font-bold text-white">{formatCurrency(emi)}</p>
                </div>

                {/* CTA */}
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-white/10 hover:bg-gold hover:text-dark-bg text-white font-bold py-3 rounded-lg transition-all text-center flex items-center justify-center gap-2"
                >
                    <MessageCircle size={20} />
                    Get Loan Assistance
                </a>
            </div>
        </div>
    );
}
