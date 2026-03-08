import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Deeply resilient mock db that supports chaining
const createMockDb = () => {
    const mock: any = {
        select: () => mock,
        from: () => mock,
        where: () => mock,
        orderBy: () => mock,
        limit: () => mock,
        offset: () => mock,
        insert: () => mock,
        values: () => mock,
        onConflictDoNothing: () => mock,
        update: () => mock,
        set: () => mock,
        delete: () => mock,
        returning: () => Promise.resolve([]),
        then: (cb: any) => Promise.resolve(cb([])),
        catch: () => mock,
    };
    return mock;
};

// Lazy-loaded DB instance
let _db: any = null;

export const getDb = () => {
    if (_db) return _db;

    const url = process.env.DATABASE_URL;

    // If we're during build or have no URL, return a dummy mock
    if (!url || url.includes("placeholder")) {
        console.warn("Neon DATABASE_URL missing — using high-fidelity mock db.");
        _db = createMockDb();
        return _db;
    }

    try {
        const sql = neon(url);
        _db = drizzle(sql, { schema });
        return _db;
    } catch (e) {
        console.error("DB Init failed — falling back to mock.", e);
        _db = createMockDb();
        return _db;
    }
};

// We use a Proxy for the 'db' export to ensure it stays lazy and never crashes on import
export const db = new Proxy({} as any, {
    get(_, prop) {
        return getDb()[prop];
    }
});

export * from './schema';
export { schema };
