require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testNewLogin() {
    console.log("\n🔐 Testing New Admin Login...\n");

    const email = 'owner@mangaloreproperties.in';
    const password = 'password123';

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error("❌ Login Failed:", error.message);
    } else {
        console.log("✅ Login Successful!");
        console.log(`   User: ${data.user.email}`);
        console.log(`   Role: ${data.user.user_metadata?.role}`);

        if (data.user.user_metadata?.role === 'admin') {
            console.log("🎉 Ready for Dashboard!");
        } else {
            console.log("⚠️  Missing admin role metadata!");
        }
    }
}

testNewLogin();
