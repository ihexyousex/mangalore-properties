const fs = require('fs');
const path = require('path');

async function addServiceRoleKey() {
    const envPath = path.join(__dirname, '.env.local');

    console.log("\n🔑 Adding Service Role Key to .env.local...\n");

    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4dGlnb3lzeW5ycnV5ZGVmZGljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDA4ODI3NCwiZXhwIjoyMDc5NjY0Mjc0fQ.nGuf37Lw-Q_dMtXfAmGEIA803Y5wXiKWWMyioXCcKV4';

    try {
        // Read existing .env.local
        let envContent = '';
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
            console.log("✅ Found existing .env.local file\n");
        } else {
            console.error("❌ .env.local not found!");
            process.exit(1);
        }

        // Check if key already exists
        const regex = /^SUPABASE_SERVICE_ROLE_KEY=.*$/m;

        if (regex.test(envContent)) {
            // Update existing key
            envContent = envContent.replace(regex, `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`);
            console.log("Updated   | SUPABASE_SERVICE_ROLE_KEY");
        } else {
            // Add new key
            envContent += `\nSUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`;
            console.log("Added     | SUPABASE_SERVICE_ROLE_KEY");
        }

        // Write back to file
        fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');

        console.log("\n✅ Successfully added Service Role Key!\n");
        console.log("⚠️  IMPORTANT: This key must remain secret!");
        console.log("⚠️  Never commit .env.local to Git\n");

    } catch (error) {
        console.error("\n❌ Error updating .env.local:", error.message);
        process.exit(1);
    }
}

addServiceRoleKey();
