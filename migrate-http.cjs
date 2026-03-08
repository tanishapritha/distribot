
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function run() {
    try {
        console.log('Using neon-http (port 443)...');

        // Create tables manually since drizzle-kit is hanging
        await sql`
      CREATE TABLE IF NOT EXISTS users (
        id text PRIMARY KEY,
        email text NOT NULL UNIQUE,
        created_at timestamp DEFAULT now() NOT NULL
      );
    `;
        console.log('Users table created.');

        await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id text NOT NULL,
        name text NOT NULL,
        product_url text NOT NULL,
        description text NOT NULL,
        audience text NOT NULL,
        pricing text NOT NULL,
        github_url text,
        repo_path text,
        keywords text[],
        created_at timestamp DEFAULT now() NOT NULL
      );
    `;
        console.log('Projects table created.');

        await sql`
      CREATE TABLE IF NOT EXISTS opportunities (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id uuid NOT NULL,
        platform text NOT NULL,
        community text,
        title text NOT NULL,
        url text NOT NULL UNIQUE,
        content text,
        score integer DEFAULT 0,
        status text DEFAULT 'new',
        created_at timestamp DEFAULT now() NOT NULL
      );
    `;
        console.log('Opportunities table created.');

        await sql`
      CREATE TABLE IF NOT EXISTS replies (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        opportunity_id uuid NOT NULL,
        text text NOT NULL,
        status text DEFAULT 'draft',
        created_at timestamp DEFAULT now() NOT NULL
      );
    `;
        console.log('Replies table created.');

        await sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email text NOT NULL UNIQUE,
        product_url text,
        category text,
        created_at timestamp DEFAULT now() NOT NULL
      );
    `;
        console.log('Waitlist table created.');

        console.log('All tables created successfully via HTTPS!');
    } catch (e) {
        console.error('Migration failed:', e);
    }
}

run();
