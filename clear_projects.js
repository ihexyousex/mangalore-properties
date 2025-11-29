const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearProjects() {
    const { error } = await supabase
        .from('projects')
        .delete()
        .neq('id', 0); // Delete all rows where id is not 0 (effectively all)

    if (error) {
        console.error('Error deleting projects:', error);
    } else {
        console.log('Successfully deleted all projects.');
    }
}

clearProjects();
