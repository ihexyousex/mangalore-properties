const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addDummyProjects() {
    const projects = [
        { name: 'Test Project 1', location: 'Mangalore', price: '50 Lakhs', status: 'Upcoming', type: 'Apartment' },
        { name: 'Test Project 2', location: 'Udupi', price: '75 Lakhs', status: 'Ready to Move', type: 'Villa' },
        { name: 'Test Project 3', location: 'Manipal', price: '1 Cr', status: 'Ongoing', type: 'Commercial' }
    ];

    const { error } = await supabase.from('projects').insert(projects);

    if (error) {
        console.error('Error adding projects:', error);
    } else {
        console.log('Successfully added 3 dummy projects.');
    }
}

addDummyProjects();
