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

async function forceReset() {
    console.log("\n🔐 Force Resetting Password (Server-Side)...\n");

    const email = 'admin@mangaloreproperties.in';
    const newPassword = 'password123';

    try {
        // 1. Find User
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

        if (listError) throw listError;

        const user = users.find(u => u.email === email);

        if (!user) {
            console.error("❌ User not found!");
            return;
        }

        console.log(`✅ Found User ID: ${user.id}`);

        // 2. Update Password
        const { data, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            {
                password: newPassword,
                email_confirm: true,
                user_metadata: { role: 'admin', name: 'Admin User' }
            }
        );

        if (updateError) throw updateError;

        console.log("✅ Password successfully updated to: password123");
        console.log("✅ Email confirmed");
        console.log("✅ Metadata updated");

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

forceReset();
