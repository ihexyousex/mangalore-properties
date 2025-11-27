const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('Missing DATABASE_URL');
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
});

async function forceCleanup() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const res = await client.query('DELETE FROM projects');
        console.log(`Deleted ${res.rowCount} rows from projects table.`);

        // Optional: Reset ID sequence if you want IDs to start from 1 again
        // await client.query('ALTER SEQUENCE projects_id_seq RESTART WITH 1');
        // console.log('Reset ID sequence.');

    } catch (err) {
        console.error('Error executing cleanup:', err);
    } finally {
        await client.end();
    }
}

forceCleanup();
