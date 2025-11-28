const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBuilderColumns() {
    console.log('Checking builders table structure...');

    // Try to insert a dummy record to see what columns are allowed/rejected or just fetch one
    const { data, error } = await supabase
        .from('builders')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching builders:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Existing builder columns:', Object.keys(data[0]));
    } else {
        console.log('No builders found, cannot infer columns from data. Attempting to insert dummy to check schema error...');
        // This is a bit hacky, but Supabase JS client doesn't have a direct "describe table" method easily accessible without SQL editor access
        // We will assume standard columns for now if empty, or try to add one.
        console.log('Table exists but is empty.');
    }
}

checkBuilderColumns();
