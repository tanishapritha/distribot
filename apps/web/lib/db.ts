import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// This is a "Frontend-Only" safe DB loader. 
// It prevents the build from failing even if the DATABASE_URL is invalid or missing.
const createClient = () => {
    const url = process.env.DATABASE_URL;

    // If we're during build and have no URL, return a dummy proxy that won't crash
    if (!url) {
        return drizzle(neon("postgresql://placeholder:5432/db"), { schema });
    }

    try {
        const sql = neon(url);
        return drizzle(sql, { schema });
    } catch (e) {
        return drizzle(neon("postgresql://placeholder:5432/db"), { schema });
    }
};

export const db = createClient();

export * from './schema';
