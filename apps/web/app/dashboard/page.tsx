import { getProjects } from "@/actions/projects";
import { getOpportunities } from "@/actions/opportunities";
import { RedirectToOnboarding } from "@/components/dashboard/redirect-onboarding";
import { Radar, MessageSquare, ExternalLink, ArrowRight, Globe } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const userProjects = await getProjects();

    if (userProjects.length === 0) {
        return <RedirectToOnboarding />;
    }

    const opps = await getOpportunities();
    const recentOpps = opps.slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-lg font-semibold text-white">Overview</h1>
                <p className="text-sm text-zinc-500 mt-0.5">
                    {userProjects[0]?.name} — distribution dashboard
                </p>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    {
                        label: "Opportunities Found",
                        value: opps.length.toString(),
                        sub: "Last 7 days",
                        icon: Radar,
                        trend: `${opps.length > 0 ? "+" + opps.length : "0"} this week`,
                        trendUp: opps.length > 0,
                    },
                    {
                        label: "Replies Generated",
                        value: "—",
                        sub: "All time",
                        icon: MessageSquare,
                        trend: "—",
                        trendUp: false,
                    },
                    {
                        label: "Posts Opened",
                        value: "—",
                        sub: "All time",
                        icon: ExternalLink,
                        trend: "—",
                        trendUp: false,
                    },
                ].map((card) => (
                    <div
                        key={card.label}
                        className="bg-[#111113] border border-zinc-800 rounded-lg p-5"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                                    {card.label}
                                </p>
                                <p className="text-2xl font-semibold text-white mt-2">{card.value}</p>
                                <p className="text-xs text-zinc-600 mt-1">{card.sub}</p>
                            </div>
                            <card.icon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        </div>
                        {card.trendUp && (
                            <p className="text-xs text-green-500 mt-3 font-medium">↑ {card.trend}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Recent Opportunities */}
            <div className="bg-[#111113] border border-zinc-800 rounded-lg">
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                    <h2 className="text-sm font-semibold text-white">Recent Opportunities</h2>
                    <Link
                        href="/dashboard/opportunities"
                        className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
                    >
                        View all <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>

                {recentOpps.length === 0 ? (
                    <div className="border-2 border-dashed border-zinc-800 rounded-lg m-5 px-6 py-10 text-center">
                        <p className="text-sm text-zinc-500 mb-1">No opportunities found yet</p>
                        <p className="text-xs text-zinc-600">Scans run every hour. Check back soon.</p>
                        <Link
                            href="/dashboard/opportunities"
                            className="inline-flex items-center gap-2 mt-4 text-xs text-amber-500 hover:text-amber-400 font-medium border border-amber-600/30 rounded-md px-3 py-1.5 bg-amber-600/10 hover:bg-amber-600/20 transition-colors"
                        >
                            Run scan now <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Platform</th>
                                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Thread</th>
                                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Score</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {recentOpps.map((opp: any) => (
                                <tr key={opp.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                                    <td className="px-5 py-3">
                                        <PlatformBadge platform={opp.platform} />
                                    </td>
                                    <td className="px-5 py-3">
                                        <p className="text-sm text-zinc-200 truncate max-w-xs">{opp.title}</p>
                                        <p className="text-xs text-zinc-600 font-mono mt-0.5">{opp.community}</p>
                                    </td>
                                    <td className="px-5 py-3">
                                        <ScoreBadge score={opp.score} />
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <Link
                                            href="/dashboard/opportunities"
                                            className="text-xs text-zinc-500 hover:text-amber-400 transition-colors"
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Projects */}
            <div className="bg-[#111113] border border-zinc-800 rounded-lg">
                <div className="px-5 py-4 border-b border-zinc-800">
                    <h2 className="text-sm font-semibold text-white">Your Projects</h2>
                </div>
                <div className="divide-y divide-zinc-800/50">
                    {userProjects.map((p) => (
                        <div key={p.id} className="px-5 py-4 flex items-center justify-between hover:bg-zinc-900/30 transition-colors">
                            <div>
                                <p className="text-sm font-medium text-white">{p.name}</p>
                                <p className="text-xs font-mono text-zinc-600 mt-0.5">
                                    {p.productUrl?.replace('https://', '')}
                                </p>
                            </div>
                            <Link
                                href="/dashboard/opportunities"
                                className="text-xs text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1 transition-colors"
                            >
                                View opportunities <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function PlatformBadge({ platform }: { platform: string }) {
    const styles: Record<string, string> = {
        reddit: "bg-orange-950/60 text-orange-400 border border-orange-900/40",
        hackernews: "bg-amber-950/60 text-amber-400 border border-amber-900/40",
        x: "bg-zinc-800 text-zinc-400 border border-zinc-700",
    };
    const key = (platform || "").toLowerCase().replace(/\s/g, "").replace("hacker", "hacker").replace("news", "news");
    const normalized = key.includes("reddit") ? "reddit" : key.includes("hacker") || key.includes("hn") ? "hackernews" : "x";
    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[normalized] || styles.x}`}>
            {platform}
        </span>
    );
}

function ScoreBadge({ score }: { score: number | null }) {
    if (!score) return <span className="text-xs text-zinc-600">—</span>;
    if (score >= 7) return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-950/60 text-green-400 border border-green-900/40">High</span>;
    if (score >= 4) return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-900/40">Medium</span>;
    return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">Low</span>;
}
