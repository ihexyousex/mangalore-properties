const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Placeholder for connection string - User might need to edit this or provide env var
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:54322/postgres";

async function runMigration() {
    console.log("Attempting to connect to:", connectionString);
    const client = new Client({
        connectionString: connectionString,
        ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const sql = fs.readFileSync(path.join(__dirname, 'add_property_details.sql'), 'utf8');
        console.log('Running SQL migration...');
        await client.query(sql);
        console.log('Migration successful!');
    } catch (err) {
        console.error('Migration failed:', err);
        console.log("If this failed due to authentication, please ensure DATABASE_URL is set or update the script with the correct connection string.");
    } finally {
        await client.end();
    }
}

runMigration();
