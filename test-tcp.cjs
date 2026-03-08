
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function test() {
    try {
        await client.connect();
        console.log('TCP Connection successful');
        const res = await client.query('SELECT 1 as connected');
        console.log('Query result:', res.rows);
        await client.end();
    } catch (e) {
        console.error('TCP Connection failed:', e);
    }
}

test();
