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

async function resetPassword() {
    console.log("\n🔐 Force Resetting Admin Password...\n");

    const email = 'admin@mangaloreproperties.in';
    const newPassword = 'password123'; // Temporary password

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        // We need the User ID first, let's fetch it
        (await fetchUserId(email)),
        { password: newPassword }
    );

    if (error) {
        console.error("❌ Reset Failed:", error.message);
    } else {
        console.log("✅ Password Reset Successful!");
        console.log(`   Email: ${email}`);
        console.log(`   New Password: ${newPassword}`);
        console.log("\n👉 Please login with this new password immediately.");
    }
}

async function fetchUserId(email) {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;
    const user = users.find(u => u.email === email);
    if (!user) throw new Error("User not found");
    return user.id;
}

resetPassword();
