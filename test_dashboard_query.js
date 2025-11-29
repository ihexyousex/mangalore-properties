require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    console.log("Testing Dashboard Query...");
    const { data, error } = await supabase
        .from("projects")
        .select("id, status, type");

    if (error) {
        console.error("Query failed:", error);
    } else {
        console.log("Query successful. Rows:", data.length);
        console.log("Sample:", data[0]);
    }
}

run();
