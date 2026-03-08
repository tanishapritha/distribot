
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function test() {
    try {
        const result = await sql`SELECT 1`;
        console.log('Connection successful:', result);
    } catch (e) {
        console.error('Connection failed:', e);
    }
}

test();
