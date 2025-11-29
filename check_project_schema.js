const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProjectColumns() {
    console.log('Checking projects table structure...');

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching projects:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Existing project columns:', Object.keys(data[0]));
    } else {
        console.log('No projects found. Attempting to insert dummy to check schema error...');
        // Just log that it's empty
        console.log('Table exists but is empty.');
    }
}

checkProjectColumns();
