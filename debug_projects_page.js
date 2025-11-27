const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugProjectsPage() {
    console.log("Fetching projects...");

    // Simulate the query in app/projects/page.tsx
    let query = supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: false });

    const { data: rawData, error } = await query;

    if (error) {
        console.error("Error fetching projects:", error);
        return;
    }

    console.log(`Fetched ${rawData.length} projects.`);

    // Simulate filtering logic
    let projects = rawData || [];
    const minPrice = 0;
    const maxPrice = 1000000000;

    try {
        projects = projects.filter((p) => {
            // Simple parser: "85 Lakhs" -> 8500000
            const parsePrice = (priceStr) => {
                if (!priceStr) {
                    console.log(`Project ${p.id} (${p.name}) has no price.`);
                    return 0;
                }
                try {
                    const clean = priceStr.toLowerCase().replace(/,/g, "");
                    if (clean.includes("crore") || clean.includes("cr")) {
                        return parseFloat(clean) * 10000000;
                    }
                    if (clean.includes("lakh") || clean.includes("l")) {
                        return parseFloat(clean) * 100000;
                    }
                    return parseFloat(clean) || 0;
                } catch (e) {
                    console.error(`Error parsing price for project ${p.id}: ${priceStr}`, e);
                    return 0;
                }
            };
            const pValue = parsePrice(p.price);
            // console.log(`Project ${p.id}: ${p.price} -> ${pValue}`);
            return pValue >= minPrice && pValue <= maxPrice;
        });
        console.log("Filtering successful.");
    } catch (e) {
        console.error("Error during filtering:", e);
    }

    // Check for potential PropertyCard issues
    projects.forEach(p => {
        if (!p.name) console.warn(`Project ${p.id} missing name`);
        if (!p.location) console.warn(`Project ${p.id} missing location`);
        if (!p.image) console.warn(`Project ${p.id} missing image`);
        // Builder check
        const builderName = p.builder || "Reputed Builder";
        // console.log(`Project ${p.id} Builder: ${builderName}`);
    });

    console.log("Debug complete.");
}

debugProjectsPage();
