
const { neon } = require('@neondatabase/serverless');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing in .env');
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function run() {
    try {
        console.log('Testing connection to:', process.env.DATABASE_URL.split('@')[1]);
        const result = await sql`SELECT 1 as connected`;
        console.log('Query result:', result);
    } catch (e) {
        console.error('Operation failed:', e);
    }
}

run();
