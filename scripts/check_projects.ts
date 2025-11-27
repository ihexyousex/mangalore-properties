
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProjects() {
    console.log('Checking projects...');
    const { data, error } = await supabase.from('projects').select('*');

    if (error) {
        console.error('Error fetching projects:', error);
    } else {
        console.log(`Found ${data.length} projects.`);
        console.log(data);
    }
}

checkProjects();
