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

async function deleteAdminUser() {
    console.log("\n🗑️  Attempting to delete admin user...\n");

    const email = 'admin@mangaloreproperties.in';

    try {
        // 1. Find User ID
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

        if (listError) {
            console.error("❌ Error listing users:", listError.message);
            return;
        }

        const user = users.find(u => u.email === email);

        if (!user) {
            console.log("⚠️  User not found. Maybe already deleted?");
            return;
        }

        console.log(`✅ Found User ID: ${user.id}`);

        // 2. Delete User
        const { data, error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

        if (deleteError) {
            console.error("❌ Delete Failed:", deleteError.message);
        } else {
            console.log("✅ User successfully deleted!");
            console.log("👉 You can now go to Supabase Dashboard and create the user again.");
        }

    } catch (error) {
        console.error("❌ Unexpected Error:", error.message);
    }
}

deleteAdminUser();
