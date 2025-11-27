const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function testConnection(port) {
    const connectionString = `postgresql://postgres:postgres@localhost:${port}/postgres`;
    const client = new Client({ connectionString });

    try {
        console.log(`Testing connection to port ${port}...`);
        await client.connect();
        console.log(`Successfully connected to port ${port}`);

        // Try to run migration if connected
        const sqlPath = path.join(__dirname, 'add_property_details.sql');
        if (fs.existsSync(sqlPath)) {
            const sql = fs.readFileSync(sqlPath, 'utf8');
            console.log('Running migration...');
            await client.query(sql);
            console.log('Migration executed successfully!');
        } else {
            console.log('Migration file not found.');
        }

        await client.end();
        return true;
    } catch (err) {
        console.log(`Failed to connect to port ${port}: ${err.message}`);
        return false;
    }
}

async function run() {
    // Try 54322 first (Supabase local default sometimes)
    let success = await testConnection(54322);

    // If failed, try 5432 (Standard Postgres)
    if (!success) {
        success = await testConnection(5432);
    }

    if (!success) {
        console.error('Could not connect to database on port 54322 or 5432.');
    }
}

run();
