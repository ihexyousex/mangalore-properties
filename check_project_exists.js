const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProject(id) {
    console.log(`Checking project ID: ${id}...`);
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id);

    if (error) {
        console.error('Error fetching project:', error.message);
        return;
    }

    if (data && data.length > 0) {
        console.log('Project found:', data[0]);
    } else {
        console.log('Project NOT found in database.');
    }
}

checkProject(23);
checkProject(24);
