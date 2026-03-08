import { db, replies, opportunities } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function RepliesPage() {
    const { userId } = await auth();
    if (!userId) return null;

    const history = await db
        .select({
            id: replies.id,
            text: replies.text,
            status: replies.status,
            createdAt: replies.createdAt,
            oppTitle: opportunities.title,
            oppUrl: opportunities.url,
            platform: opportunities.platform
        })
        .from(replies)
        .innerJoin(opportunities, eq(replies.opportunityId, opportunities.id))
        .orderBy(desc(replies.createdAt));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-lg font-semibold text-white">Reply History</h1>
                <p className="text-sm text-zinc-500 mt-0.5">{history.length} replies generated</p>
            </div>

            <div className="bg-[#111113] border border-zinc-800 rounded-lg overflow-hidden">
                {history.length === 0 ? (
                    <div className="border-2 border-dashed border-zinc-800 rounded-lg m-5 px-6 py-12 text-center">
                        <p className="text-sm text-zinc-500 mb-1">No replies generated yet</p>
                        <p className="text-xs text-zinc-600 mb-4">Head to Opportunities to get started</p>
                        <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium gap-2">
                            <Link href="/dashboard/opportunities">
                                Browse Opportunities <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Thread</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Platform</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Status</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Generated</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-zinc-200 truncate max-w-xs">{item.oppTitle}</p>
                                        {item.text && (
                                            <p className="text-xs text-zinc-600 font-mono mt-0.5 truncate max-w-xs">
                                                {item.text.substring(0, 60)}...
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <PlatformBadge platform={item.platform} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-4 py-3 text-xs text-zinc-500">
                                        {item.createdAt.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <a
                                            href={item.oppUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-amber-400 transition-colors"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

function PlatformBadge({ platform }: { platform: string }) {
    const key = (platform || "").toLowerCase();
    if (key.includes("reddit")) return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-950/60 text-orange-400 border border-orange-900/40">Reddit</span>;
    if (key.includes("hacker") || key === "hn") return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-900/40">HN</span>;
    return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">X</span>;
}

function StatusBadge({ status }: { status: string | null }) {
    if (status === "posted") return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-950/60 text-green-400 border border-green-900/40">Posted</span>;
    if (status === "copied") return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-900/40">Copied</span>;
    return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">Draft</span>;
}
