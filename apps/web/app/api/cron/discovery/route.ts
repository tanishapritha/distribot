import { db, projects, opportunities } from "@/lib/db";
import { findOpportunities } from "@/lib/discovery";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Build-time guard for Vercel static analysis
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ success: true, message: "Build phase static analysis bypass" });
    }

    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const allProjects = await db.select().from(projects);

        for (const project of allProjects) {
            console.log(`Scanning opportunities for project: ${project.name}`);
            try {
                const freshOpps = await findOpportunities(project);

                for (const opp of freshOpps) {
                    try {
                        await db.insert(opportunities).values({
                            projectId: project.id,
                            platform: opp.platform,
                            community: opp.community,
                            title: opp.title,
                            url: opp.url,
                            score: Math.floor(Math.random() * 5) + 5,
                        }).onConflictDoNothing();
                    } catch (e) {
                        // Skip duplicates or insert errors
                    }
                }
            } catch (discoveryError) {
                console.error(`Discovery failed for project ${project.name}`, discoveryError);
            }
        }

        return NextResponse.json({ success: true, projectCount: allProjects.length });
    } catch (globalError) {
        console.error("Cron discovery failed — DB might be unreachable", globalError);
        return NextResponse.json({ success: false, error: "Database unreachable" }, { status: 500 });
    }
}
