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

async function createNewAdmin() {
    console.log("\n👤 Creating NEW Admin User (owner@mangaloreproperties.in)...\n");

    const email = 'owner@mangaloreproperties.in';
    const password = 'password123';

    try {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: { role: 'admin', name: 'Owner' }
        });

        if (error) {
            console.error("❌ Creation Failed:", error.message);
        } else {
            console.log("✅ User Successfully Created!");
            console.log(`   Email: ${data.user.email}`);
            console.log(`   ID: ${data.user.id}`);
            console.log("\n👉 Please login with:");
            console.log(`   Email: ${email}`);
            console.log(`   Password: ${password}`);
        }

    } catch (error) {
        console.error("❌ Unexpected Error:", error.message);
    }
}

createNewAdmin();
