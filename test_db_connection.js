const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        console.error('DATABASE_URL is not defined in .env.local');
        return false;
    }

    const client = new Client({ connectionString });

    try {
        console.log(`Testing connection to database...`);
        await client.connect();
        console.log(`Successfully connected to database!`);

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
        console.log(`Failed to connect: ${err.message}`);
        return false;
    }
}

async function run() {
    await testConnection();
}

run();
