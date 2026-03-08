"use server"

import { db, projects } from "@/lib/db";
import { getAuthSafe } from "@/lib/auth-safe";
import { eq } from "drizzle-orm";
import { generateQueries } from "@/lib/ai";

export async function getProjects() {
    const { userId } = await getAuthSafe();
    if (!userId) return [];

    try {
        return await db.select().from(projects).where(eq(projects.userId, userId));
    } catch (e) {
        console.warn("DB not ready yet — returning empty projects array", e);
        return [];
    }
}

export type CreateProjectInput = {
    name?: string
    description?: string
    productUrl?: string
    audience?: string
    pricing?: string
    category?: string
    customerType?: string
    platforms?: ('reddit' | 'hn')[]
    subreddits?: string[]
    replyTone?: 'conversational' | 'direct' | 'technical'
    replyStyle?: 'subtle' | 'clear'
}

export async function createProject(data: CreateProjectInput) {
    const { userId } = await getAuthSafe();
    if (!userId) throw new Error("Unauthorized");

    // Apply defaults
    const name = data.name?.trim() || "My Project";
    const productUrl = data.productUrl?.trim() || "https://example.com";
    const audience = data.customerType || data.audience?.trim() || "Founders & Startups";
    const pricing = data.pricing?.trim() || "Unknown";

    const platforms = data.platforms?.length ? data.platforms : ['reddit', 'hn'];
    const subreddits = data.subreddits?.length
        ? data.subreddits
        : ['SaaS', 'entrepreneur', 'startups', 'SideProject'];
    const replyTone = data.replyTone || 'conversational';
    const replyStyle = data.replyStyle || 'subtle';

    const contextParts: string[] = [];
    if (data.description?.trim()) contextParts.push(data.description.trim());
    if (data.category) contextParts.push(`Category: ${data.category}`);
    if (data.customerType) contextParts.push(`Target customers: ${data.customerType}`);
    contextParts.push(`Platforms: ${platforms.join(', ')}`);
    contextParts.push(`Subreddits: ${subreddits.map(s => `r/${s.replace(/^r\//, '')}`).join(', ')}`);
    contextParts.push(`Reply tone: ${replyTone}`);
    contextParts.push(`Reply style: ${replyStyle}`);

    const description = contextParts.join('\n') || "No description provided. Generate a helpful, generic reply.";

    let keywords: string[] = [name];
    try {
        if (data.description?.trim()) {
            keywords = await generateQueries(data.description);
        }
    } catch (e) {
        console.error("AI Keyword generation failed — using default", e);
    }

    try {
        const [newProject] = await db.insert(projects).values({
            userId,
            name,
            productUrl,
            description,
            audience,
            pricing,
            keywords,
        }).returning();
        return newProject;
    } catch (e) {
        console.error("Critical onboarding error: Database is unreachable during project creation.", e);
        throw new Error("Distribution server offline. Profile cannot be saved yet.");
    }
}
