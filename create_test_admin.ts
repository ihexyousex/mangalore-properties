import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestAdmin() {
    const email = 'testadmin@example.com';
    const password = 'password123';

    console.log(`Creating test admin: ${email}`);

    // 1. Delete if exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers.users.find(u => u.email === email);

    if (existingUser) {
        console.log('User exists, deleting...');
        await supabase.auth.admin.deleteUser(existingUser.id);
    }

    // 2. Create user
    const { data: user, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'admin' }
    });

    if (error) {
        console.error('❌ Failed to create user:', error.message);
    } else {
        console.log('✅ Test admin created successfully!');
        console.log('ID:', user.user.id);
    }
}

createTestAdmin();
