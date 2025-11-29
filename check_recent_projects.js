const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listProjects() {
    console.log("--- Listing Projects ---");
    const { data, error } = await supabase
        .from('projects')
        .select('id, name, status')
        .order('id', { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching projects:", error);
    } else {
        console.log("Projects found:", data);
    }
}

listProjects();
