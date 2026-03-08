import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const getDb = () => {
    if (!process.env.DATABASE_URL) {
        console.warn("DATABASE_URL is missing. DB operations will fail.");
        return null as any;
    }
    const sql = neon(process.env.DATABASE_URL!);
    return drizzle(sql, { schema });
};

export const db = getDb();
export * from './schema';
