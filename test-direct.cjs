
const { neon } = require('@neondatabase/serverless');

async function test() {
    const url = "postgres://neondb_owner:npg_Es1OxjKRinL7@ep-quiet-firefly-ai8z6t7n-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";
    const sql = neon(url);
    try {
        console.log('Testing with clean postgres:// URL...');
        const result = await sql`SELECT 1 as val`;
        console.log('Success:', result);
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
