"use server"

import { db, opportunities, projects } from "@/lib/db";
import { getAuthSafe } from "@/lib/auth-safe";
import { eq, desc, inArray } from "drizzle-orm";
import { findOpportunities } from "@/lib/discovery";

export async function getOpportunities() {
    const { userId } = await getAuthSafe();
    if (!userId) return [];

    try {
        const userProjects = await db.select().from(projects).where(eq(projects.userId, userId));
        const projectIds = userProjects.map((p: any) => p.id);

        if (projectIds.length === 0) return [];

        return await db.select().from(opportunities)
            .where(inArray(opportunities.projectId, projectIds))
            .orderBy(desc(opportunities.createdAt));
    } catch (e) {
        console.warn("DB not ready yet — returning empty opportunities array", e);
        return [];
    }
}

export async function getProjectOpportunities(projectId: string) {
    const { userId } = await getAuthSafe();
    if (!userId) return [];

    try {
        return await db.select().from(opportunities).where(eq(opportunities.projectId, projectId)).orderBy(desc(opportunities.score));
    } catch (e) {
        console.error("Failed to fetch opportunities for project", e);
        return [];
    }
}

export async function runDiscoveryForUser() {
    const { userId } = await getAuthSafe();
    if (!userId) return;

    try {
        const userProjects = await db.select().from(projects).where(eq(projects.userId, userId));

        for (const project of userProjects) {
            const freshOpps = await findOpportunities(project);
            for (const opp of freshOpps) {
                try {
                    await db.insert(opportunities).values({
                        projectId: project.id,
                        platform: opp.platform,
                        community: opp.community,
                        title: opp.title,
                        url: opp.url,
                        content: opp.content,
                        score: opp.score,
                    }).onConflictDoNothing();
                } catch (e) {
                    // Ignore transient insert errors
                }
            }
        }
    } catch (e) {
        console.error("Discovery failed: DB heartbeat lost.", e);
    }
}
