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

async function checkUser() {
    console.log("\n🔍 Checking Admin User Status...\n");

    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
        console.error("Error fetching users:", error);
        return;
    }

    const adminUser = users.find(u => u.email === 'admin@mangaloreproperties.in');

    if (adminUser) {
        console.log("✅ User Found:");
        console.log(`   Email: ${adminUser.email}`);
        console.log(`   Confirmed At: ${adminUser.email_confirmed_at ? '✅ ' + adminUser.email_confirmed_at : '❌ Not Confirmed'}`);
        console.log(`   Role Metadata: ${adminUser.user_metadata?.role === 'admin' ? '✅ Admin' : '❌ ' + (adminUser.user_metadata?.role || 'None')}`);
        console.log(`   Last Sign In: ${adminUser.last_sign_in_at || 'Never'}`);
    } else {
        console.log("❌ Admin user 'admin@mangaloreproperties.in' NOT FOUND");
    }
}

checkUser();
