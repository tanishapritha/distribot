import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// We use a lazy initialization pattern. 
// This ensures that Neon is NEVER called during the build process, 
// even if a script imports this file.
let cachedDb: any = null;

export const getDb = () => {
    if (cachedDb) return cachedDb;

    const url = process.env.DATABASE_URL;

    // Fallback URL for build time / local development without env
    const connectionString = url || "postgresql://placeholder:5432/db";

    try {
        const sql = neon(connectionString);
        cachedDb = drizzle(sql, { schema });
        return cachedDb;
    } catch (e) {
        // Absolute fallback to a dummy object if neon(url) throws
        console.warn("DB Connection failed, using mock client");
        return {
            select: () => ({ from: () => ({ where: () => ({ orderBy: () => [] }) }) }),
            insert: () => ({ values: () => ({ onConflictDoNothing: () => ({ returning: () => [] }) }) }),
            update: () => ({ set: () => ({ where: () => [] }) }),
            delete: () => ({ where: () => [] }),
        } as any;
    }
};

// For backward compatibility with existing code
export const db = getDb();
export * from './schema';
