require('dotenv').config({ path: '.env.local' });
if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL exists');
    // console.log(process.env.DATABASE_URL); // Don't print secrets
} else {
    console.log('DATABASE_URL missing');
}
