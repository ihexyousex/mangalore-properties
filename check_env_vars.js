const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

console.log("Checking .env.local variables:");
console.log("NEXT_PUBLIC_SUPABASE_URL:", envConfig.NEXT_PUBLIC_SUPABASE_URL ? "✅ Present" : "❌ Missing");
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Present" : "❌ Missing");
