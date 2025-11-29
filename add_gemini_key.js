const fs = require('fs');
const path = require('path');

async function addGeminiKey() {
    const envPath = path.join(__dirname, '.env.local');

    console.log("\n🔧 Adding Gemini API key to .env.local...\n");

    const geminiKey = 'AIzaSyBUoLbzHuzHZrNiGn2WF7EeJ-aWPbRNdo0';

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
        const regex = /^GEMINI_API_KEY=.*$/m;

        if (regex.test(envContent)) {
            // Update existing key
            envContent = envContent.replace(regex, `GEMINI_API_KEY=${geminiKey}`);
            console.log("Updated   | GEMINI_API_KEY");
        } else {
            // Add new key
            envContent += `\nGEMINI_API_KEY=${geminiKey}`;
            console.log("Added     | GEMINI_API_KEY");
        }

        // Write back to file
        fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');

        console.log("\n✅ Successfully added Gemini API key!\n");
        console.log("You now have ALL 5 API keys configured! 🎉\n");

    } catch (error) {
        console.error("\n❌ Error updating .env.local:", error.message);
        process.exit(1);
    }
}

addGeminiKey();
