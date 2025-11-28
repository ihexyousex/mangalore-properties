require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testRead() {
    console.log("\n🔍 Testing Public Read Access...\n");

    const { data, error } = await supabase
        .from('projects')
        .select('count', { count: 'exact', head: true });

    if (error) {
        console.error("❌ Read Failed!");
        console.error("Error:", error);
    } else {
        console.log("✅ Read Successful!");
        console.log("Database is accessible.");
    }
}

testRead();
