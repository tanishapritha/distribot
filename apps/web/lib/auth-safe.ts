import { auth } from "@clerk/nextjs/server";

/**
 * A build-safe and runtime-safe auth wrapper.
 * Returns null if Clerk is not configured or if there's an error.
 */
export async function getAuthSafe() {
    // If keys are missing, we're in "Frontend-Only" mode. Return null.
    if (!process.env.CLERK_SECRET_KEY) {
        return { userId: null };
    }

    try {
        return await auth();
    } catch (e) {
        console.warn("Clerk auth failed (is the secret key set correctly?)", e);
        return { userId: null };
    }
}
