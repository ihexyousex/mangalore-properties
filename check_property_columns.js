const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    console.log('Checking if property detail columns exist...\n');

    // Fetch one project to see available columns
    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    const detailFields = [
        'total_units',
        'project_size',
        'launch_date',
        'possession_date',
        'rera_id',
        'carpet_area',
        'floor_number',
        'total_floors',
        'furnished_status',
        'bathrooms',
        'parking_count',
        'maintenance_charges',
        'security_deposit',
        'preferred_tenants'
    ];

    console.log('Field Status:');
    console.log('='.repeat(50));
    detailFields.forEach(field => {
        const exists = field in project;
        const hasValue = project[field] !== null && project[field] !== undefined;
        const value = project[field];
        console.log(`${field.padEnd(25)} | ${exists ? '✓ Exists' : '✗ Missing'} | ${hasValue ? `Value: ${value}` : 'Empty'}`);
    });

    console.log('\n' + '='.repeat(50));
    console.log('\nSample project ID:', project.id);
    console.log('Sample project name:', project.name);
}

checkColumns();
