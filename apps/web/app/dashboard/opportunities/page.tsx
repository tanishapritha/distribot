import { getOpportunities } from "@/actions/opportunities";
import { getProjects } from "@/actions/projects";
import { RefreshOpportunitiesButton } from "@/components/dashboard/refresh-button";
import { OpportunitiesClient } from "@/components/dashboard/opportunities-client";
import { SetupNudgeBanner } from "@/components/dashboard/setup-nudge";

export const dynamic = 'force-dynamic';

export default async function OpportunitiesPage() {
    const [opps, projects] = await Promise.all([
        getOpportunities(),
        getProjects(),
    ]);

    // Consider setup incomplete if the project was created with no real description
    const project = projects[0];
    const isIncomplete =
        !project ||
        !project.description ||
        project.description.startsWith("No description") ||
        project.name === "My Project";

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-white">Opportunities</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">
                        High-intent threads found across Reddit and Hacker News
                    </p>
                </div>
                <RefreshOpportunitiesButton />
            </div>

            <SetupNudgeBanner incomplete={isIncomplete} />

            <OpportunitiesClient opps={opps as any} />
        </div>
    );
}
