require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testLogin() {
    console.log("\n🔐 Testing Login Credentials...\n");

    const email = 'admin@mangaloreproperties.in';
    const password = 'admin123';

    console.log(`Attempting login for: ${email}`);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error("\n❌ Login Failed!");
        console.error(`   Error: ${error.message}`);

        if (error.message.includes("Email not confirmed")) {
            console.log("\n👉 ACTION REQUIRED: You must run the SQL to confirm the email.");
        } else if (error.message.includes("Invalid login credentials")) {
            console.log("\n👉 ACTION REQUIRED: Password might be wrong. Try resetting it.");
        }
    } else {
        console.log("\n✅ Login Successful!");
        console.log(`   User ID: ${data.user.id}`);
        console.log(`   Email: ${data.user.email}`);
        console.log(`   Role Metadata: ${data.user.user_metadata?.role}`);

        if (data.user.user_metadata?.role !== 'admin') {
            console.log("\n⚠️  WARNING: User is logged in but does NOT have 'admin' role metadata!");
        } else {
            console.log("\n🎉 Account is fully ready for Admin Dashboard access.");
        }
    }
}

testLogin();
