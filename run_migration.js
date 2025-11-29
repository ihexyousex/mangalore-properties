require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('Updating Master Admin email...');
    const { error: e1, data: d1 } = await supabase
        .from('admins')
        .update({ email: 'admin@mangaloreproperties.in' })
        .eq('email', 'admin@mangaloreproperties.com')
        .select();

    if (e1) {
        console.error('Error updating Master Admin:', e1);
    } else {
        console.log('Master Admin updated:', d1);
    }

    console.log('Updating Partner Admin email...');
    const { error: e2, data: d2 } = await supabase
        .from('admins')
        .update({ email: 'partner@mangaloreproperties.in' })
        .eq('email', 'partner@mangaloreproperties.com')
        .select();

    if (e2) {
        console.error('Error updating Partner Admin:', e2);
    } else {
        console.log('Partner Admin updated:', d2);
    }
}

run();
