const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdminUsers() {
    console.log('🔍 Checking for admin users...\n');

    // Note: We can't directly query auth.users table with anon key
    // But we can check if we have any users in the admins table if it exists
    const { data: admins, error: adminsError } = await supabase
        .from('admins')
        .select('*');

    if (!adminsError && admins) {
        console.log('📋 Users in admins table:', admins.length);
        admins.forEach(admin => {
            console.log(`  - ${admin.email} (${admin.name || 'No name'})`);
        });
        console.log();
    }

    console.log('ℹ️  To verify Supabase Auth users with admin role:');
    console.log('   1. Go to your Supabase Dashboard');
    console.log('   2. Navigate to Authentication → Users');
    console.log('   3. Check if your user has "role": "admin" in user_metadata');
    console.log();
    console.log('   Or run this SQL query in SQL Editor:');
    console.log('   SELECT id, email, raw_user_meta_data FROM auth.users;');
}

checkAdminUsers();
