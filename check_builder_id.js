const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBuilderId() {
    const { data, error } = await supabase
        .from('projects')
        .select('builder_id')
        .limit(1);

    if (error) {
        console.log('Error or column missing:', error.message);
    } else {
        console.log('Column builder_id EXISTS.');
    }
}

checkBuilderId();
