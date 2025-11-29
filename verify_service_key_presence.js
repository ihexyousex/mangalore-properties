const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env.local
const envConfig = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), '.env.local')));

if (envConfig.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('SUCCESS: SUPABASE_SERVICE_ROLE_KEY is present.');
    console.log('Length:', envConfig.SUPABASE_SERVICE_ROLE_KEY.length);
} else {
    console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is MISSING in .env.local');
}
