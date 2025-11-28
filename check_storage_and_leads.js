const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role to check everything

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorage() {
    console.log("--- Checking Storage ---");
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
        console.error("Error listing buckets:", error);
    } else {
        const bucket = buckets.find(b => b.name === 'property-images');
        if (bucket) {
            console.log("✅ Bucket 'property-images' exists.");
            console.log("   Public:", bucket.public);
        } else {
            console.log("❌ Bucket 'property-images' NOT found.");
        }
    }
}

async function checkLeadsRLS() {
    console.log("\n--- Checking Leads Table Permissions ---");
    // Try to insert as anon user
    const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const testLead = {
        name: "Test User",
        phone: "1234567890",
        email: "test@example.com",
        project: "Test Project"
    };

    const { data, error } = await anonClient.from('leads').insert(testLead).select();

    if (error) {
        console.log("❌ Public Insert to 'leads' FAILED:", error.message);
        console.log("   (This is expected if RLS blocks public inserts)");
    } else {
        console.log("✅ Public Insert to 'leads' SUCCEEDED.");
        // Clean up
        if (data && data[0]) {
            await supabase.from('leads').delete().eq('id', data[0].id);
        }
    }
}

async function run() {
    await checkStorage();
    await checkLeadsRLS();
}

run();
