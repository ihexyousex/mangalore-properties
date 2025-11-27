const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select('id, name');

    if (error) {
        console.error('Error fetching projects:', error);
    } else {
        console.log('Projects in Database:');
        data.forEach(p => {
            console.log(`- [${p.id}] ${p.name}`);
        });
    }
}

listProjects();
