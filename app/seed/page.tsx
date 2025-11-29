
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SeedPage() {
    const [status, setStatus] = useState("Idle");

    const seedBuilders = async () => {
        setStatus("Seeding...");

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setStatus("Error: Not Logged In. Please log in via the main site first.");
            return;
        }

        const sampleBuilders = [
            { name: 'Prestige Group', slug: 'prestige-group' },
            { name: 'Brigade Group', slug: 'brigade-group' },
            { name: 'NorthernSky Properties', slug: 'northernsky-properties' },
            { name: 'Land Trades', slug: 'land-trades' }
        ];

        const { data, error } = await supabase.from('builders').insert(sampleBuilders).select();

        if (error) setStatus(`Error: ${error.message}`);
        else setStatus(`Success! Inserted ${data.length} builders.`);
    };

    return (
        <div className="p-10 text-white">
            <h1 className="text-2xl mb-4">Seeder</h1>
            <p className="mb-4">Status: {status}</p>
            <button onClick={seedBuilders} className="bg-green-500 px-4 py-2 rounded">
                Seed Builders (Requires Login)
            </button>
        </div>
    );
}
