import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    '/',
    '/api/waitlist(.*)',
    '/api/cron/discovery(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/dashboard(.*)'
]);

// Next.js 16 requires a single named 'proxy' export.
// We only initialize Clerk if the secret key exists.
export const proxy = (request: any, event: any) => {
    if (!process.env.CLERK_SECRET_KEY) {
        return; // Silent bypass for frontend-only mode
    }

    return clerkMiddleware(async (auth, req) => {
        if (!isPublicRoute(req)) {
            await auth.protect();
        }
    })(request, event);
};

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
