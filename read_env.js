const fs = require('fs');
try {
    const env = fs.readFileSync('.env.local', 'utf8');
    console.log(env);
} catch (e) {
    console.error(e);
}
