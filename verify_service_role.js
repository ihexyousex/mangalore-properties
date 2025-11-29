require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

async function verifyKey() {
    console.log("\n🔑 Verifying Service Role Key...\n");

    // Try to insert a dummy row into projects (which requires admin)
    // We'll use a transaction or just delete it immediately if possible, 
    // but actually just reading users is a good test of service role.

    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
        console.error("❌ Key Verification Failed!");
        console.error("Error:", error.message);
    } else {
        console.log("✅ Key Verification Successful!");
        console.log(`   Found ${users.length} users.`);
    }
}

verifyKey();
