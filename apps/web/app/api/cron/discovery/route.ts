import { db, projects, opportunities } from "@/lib/db";
import { findOpportunities } from "@/lib/discovery";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    const allProjects = await db.select().from(projects);

    for (const project of allProjects) {
        console.log(`Scanning opportunities for project: ${project.name}`);
        const freshOpps = await findOpportunities(project);

        for (const opp of freshOpps) {
            try {
                await db.insert(opportunities).values({
                    projectId: project.id,
                    platform: opp.platform,
                    community: opp.community,
                    title: opp.title,
                    url: opp.url,
                    score: Math.floor(Math.random() * 5) + 5, // Mock scoring for now
                }).onConflictDoNothing();
            } catch (e) {
                // Skip duplicates
            }
        }
    }

    return NextResponse.json({ success: true, projectCount: allProjects.length });
}
