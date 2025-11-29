require('dotenv').config({ path: '.env.local' });
const https = require('https');

function testLoginRaw() {
    console.log("\n🔐 Testing Login via Raw API...\n");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !apiKey) {
        console.error("Missing env variables");
        return;
    }

    const data = JSON.stringify({
        email: 'admin@mangaloreproperties.in',
        password: 'admin123'
    });

    const url = new URL(`${supabaseUrl}/auth/v1/token?grant_type=password`);

    const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
            'apikey': apiKey,
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log(`Status Code: ${res.statusCode}`);
            try {
                const json = JSON.parse(body);
                if (res.statusCode === 200) {
                    console.log("\n✅ Login Successful!");
                    console.log(`   User ID: ${json.user.id}`);
                    console.log(`   Email: ${json.user.email}`);
                    console.log(`   Role Metadata: ${json.user.user_metadata?.role}`);
                } else {
                    console.log("\n❌ Login Failed!");
                    console.log(`   Error: ${json.error_description || json.msg || json.message}`);
                    console.log(`   Code: ${json.error_code || json.code}`);
                }
            } catch (e) {
                console.log("Raw Response:", body);
            }
        });
    });

    req.on('error', (error) => {
        console.error("Request Error:", error);
    });

    req.write(data);
    req.end();
}

testLoginRaw();
