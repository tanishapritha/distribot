import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    '/',
    '/api/waitlist(.*)',
    '/api/cron/discovery(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/dashboard(.*)' // Temporarily public for frontend-only deployment
]);

export default clerkMiddleware(async (auth, request) => {
    // We bypass protection if keys are missing OR to ensure the frontend is always visible
    if (!process.env.CLERK_SECRET_KEY) return;

    if (!isPublicRoute(request)) {
        await auth.protect();
    }
});

// Named export for Next.js 16
export const proxy = clerkMiddleware(async (auth, request) => {
    if (!process.env.CLERK_SECRET_KEY) return;
    if (!isPublicRoute(request)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
