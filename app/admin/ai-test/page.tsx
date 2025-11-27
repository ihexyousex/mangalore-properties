"use client";

import React, { useState } from "react";
import { runAI } from "@/app/actions/ai";

export default function AITestPage() {
    // Force rebuild
    const [input, setInput] = useState("");
    const [task, setTask] = useState("listing");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        setLoading(true);
        setResult(null);
        try {
            const response = await runAI(task, input);
            setResult(response);
        } catch (error) {
            setResult({ error: "Failed to run AI" });
        } finally {
            setLoading(false);
        }
    };

    const handleGetModels = async () => {
        setLoading(true);
        try {
            const { getModels } = await import("@/app/actions/ai");
            const models = await getModels();
            setResult(models);
        } catch (e) {
            setResult({ error: "Failed to get models" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-neutral-900 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-4">Gemini AI Test</h1>

            <div className="flex gap-4 mb-4">
                <select
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    className="bg-neutral-800 p-2 rounded"
                >
                    <option value="listing">Listing Generator</option>
                    <option value="builder">Builder Bio</option>
                    <option value="email">Email Reply</option>
                    <option value="seo">SEO Generator</option>
                </select>
                <button
                    onClick={handleGetModels}
                    className="bg-neutral-700 px-4 py-2 rounded hover:bg-neutral-600"
                >
                    Check Config
                </button>
            </div>

            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input here..."
                className="w-full h-32 bg-neutral-800 p-4 rounded mb-4 text-white"
            />

            <button
                onClick={handleRun}
                disabled={loading}
                className="bg-amber-500 text-black px-4 py-2 rounded font-bold hover:bg-amber-400 disabled:opacity-50"
            >
                {loading ? "Generating..." : "Run AI"}
            </button>

            {result && (
                <div className="mt-8 p-4 bg-neutral-800 rounded">
                    <h2 className="text-xl font-bold mb-2">Result:</h2>
                    <pre className="whitespace-pre-wrap text-sm text-neutral-300">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
