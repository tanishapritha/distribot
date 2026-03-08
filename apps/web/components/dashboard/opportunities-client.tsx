"use client"

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Copy, Check, ExternalLink, Loader2, RefreshCw, X, MessageSquarePlus
} from "lucide-react";
import { createAIReply } from "@/actions/replies";

type Opportunity = {
    id: string;
    title: string;
    url: string;
    platform: string;
    community: string;
    score: number | null;
    content?: string | null;
};

function PlatformBadge({ platform }: { platform: string }) {
    const key = (platform || "").toLowerCase();
    if (key.includes("reddit")) return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-950/60 text-orange-400 border border-orange-900/40">Reddit</span>;
    if (key.includes("hacker") || key === "hn") return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-900/40">HN</span>;
    return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">X</span>;
}

function ScoreBadge({ score }: { score: number | null }) {
    if (!score) return <span className="text-xs text-zinc-600">—</span>;
    if (score >= 7) return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-950/60 text-green-400 border border-green-900/40">High</span>;
    if (score >= 4) return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-900/40">Medium</span>;
    return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">Low</span>;
}

function ReplyDrawer({
    opportunity,
    onClose,
}: {
    opportunity: Opportunity;
    onClose: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [reply, setReply] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    async function handleGenerate() {
        setLoading(true);
        try {
            const res = await createAIReply(opportunity.id);
            setReply(res.text);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleCopy() {
        if (!reply) return;
        await navigator.clipboard.writeText(reply);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="w-[420px] shrink-0 border-l border-zinc-800 bg-[#111113] flex flex-col h-full fixed right-0 top-[52px] bottom-0 z-20 shadow-xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
                <div className="flex-1 pr-4 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <PlatformBadge platform={opportunity.platform} />
                        <ScoreBadge score={opportunity.score} />
                    </div>
                    <p className="text-sm font-medium text-white leading-snug line-clamp-2">
                        {opportunity.title}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors mt-0.5 shrink-0"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Thread Preview */}
            <div className="px-5 pt-4 pb-0 shrink-0">
                <p className="text-xs uppercase tracking-widest text-zinc-600 font-medium mb-2">Source Thread</p>
                <div className="bg-zinc-900 rounded-md p-4 max-h-[160px] overflow-y-auto">
                    <p className="text-sm text-zinc-400 font-mono leading-relaxed">
                        {opportunity.content || opportunity.title}
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 px-5 py-4 shrink-0">
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-xs uppercase tracking-widest text-zinc-600 font-medium">AI Generated Reply</span>
                <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* Reply area */}
            <div className="flex-1 px-5 flex flex-col gap-4">
                {!reply && !loading && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <MessageSquarePlus className="h-8 w-8 text-zinc-700 mb-3" />
                        <p className="text-sm text-zinc-500 mb-4">Generate a contextual reply based on your product profile.</p>
                        <Button
                            onClick={handleGenerate}
                            className="bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium gap-2"
                        >
                            Generate Reply
                        </Button>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Loader2 className="h-6 w-6 text-amber-500 animate-spin mb-3" />
                        <p className="text-sm text-zinc-500">Writing your reply...</p>
                    </div>
                )}

                {reply && !loading && (
                    <div className="space-y-3">
                        <Textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            className="bg-zinc-900 border-zinc-700 focus:border-amber-600 focus:ring-0 rounded-md text-sm text-white min-h-[160px] resize-none p-3"
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            {reply && (
                <div className="shrink-0 border-t border-zinc-800 p-5 space-y-3">
                    <div className="flex gap-2">
                        <Button
                            onClick={handleCopy}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium gap-2"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? "Copied!" : "Copy Reply"}
                        </Button>
                        <Button
                            variant="outline"
                            className="border-zinc-700 hover:border-zinc-500 text-zinc-300 rounded-md text-sm gap-2 bg-transparent"
                            onClick={() => window.open(opportunity.url, "_blank")}
                        >
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-zinc-500 hover:text-zinc-300 rounded-md text-sm gap-2"
                            onClick={() => setReply(null)}
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <p className="text-xs text-zinc-600 text-center">
                        Review before posting. Once copied, this is marked as replied.
                    </p>
                </div>
            )}
        </div>
    );
}

export function OpportunitiesClient({ opps }: { opps: Opportunity[] }) {
    const [activeOpp, setActiveOpp] = useState<Opportunity | null>(null);
    const [platformFilter, setPlatformFilter] = useState<string>("all");
    const [scoreFilter, setScoreFilter] = useState<string>("all");
    const [loading, setLoading] = useState(false);

    const filtered = opps.filter((o) => {
        const matchPlatform =
            platformFilter === "all" ||
            (platformFilter === "reddit" && o.platform.toLowerCase().includes("reddit")) ||
            (platformFilter === "hn" && (o.platform.toLowerCase().includes("hacker") || o.platform.toLowerCase() === "hn")) ||
            (platformFilter === "x" && o.platform.toLowerCase() === "x");
        const matchScore =
            scoreFilter === "all" ||
            (scoreFilter === "high" && (o.score ?? 0) >= 7) ||
            (scoreFilter === "medium" && (o.score ?? 0) >= 4 && (o.score ?? 0) < 7);
        return matchPlatform && matchScore;
    });

    const platforms = [
        { key: "all", label: "All" },
        { key: "reddit", label: "Reddit" },
        { key: "hn", label: "Hacker News" },
        { key: "x", label: "X" },
    ];

    return (
        <div className="flex gap-0 relative">
            {/* Main table area */}
            <div className={`flex-1 min-w-0 transition-all duration-300 ${activeOpp ? "mr-[420px]" : ""}`}>
                <div className="space-y-4">
                    {/* Page header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-semibold text-white">Opportunities</h1>
                            <p className="text-sm text-zinc-500 mt-0.5">{filtered.length} results found</p>
                        </div>
                    </div>

                    {/* Filter bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                        <div className="flex gap-1">
                            {platforms.map((p) => (
                                <button
                                    key={p.key}
                                    onClick={() => setPlatformFilter(p.key)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${platformFilter === p.key
                                            ? "bg-amber-600 text-white"
                                            : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                                        }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                        <select
                            value={scoreFilter}
                            onChange={(e) => setScoreFilter(e.target.value)}
                            className="text-xs bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-zinc-400 focus:border-amber-600 focus:outline-none"
                        >
                            <option value="all">All Scores</option>
                            <option value="high">High Only</option>
                            <option value="medium">Medium+</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="bg-[#111113] border border-zinc-800 rounded-lg overflow-hidden">
                        {filtered.length === 0 ? (
                            <div className="border-2 border-dashed border-zinc-800 rounded-lg m-5 px-6 py-12 text-center">
                                <p className="text-sm text-zinc-500 mb-1">No opportunities match your filters</p>
                                <p className="text-xs text-zinc-600">Try adjusting the platform or score filter above</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-zinc-800">
                                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Platform</th>
                                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Thread</th>
                                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Score</th>
                                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">Community</th>
                                        <th className="px-4 py-3" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((opp) => (
                                        <tr
                                            key={opp.id}
                                            className={`border-b border-zinc-800/50 hover:bg-zinc-900/50 cursor-pointer transition-colors ${activeOpp?.id === opp.id ? "bg-zinc-900/70" : ""
                                                }`}
                                            onClick={() => setActiveOpp(activeOpp?.id === opp.id ? null : opp)}
                                        >
                                            <td className="px-4 py-3">
                                                <PlatformBadge platform={opp.platform} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-zinc-200 truncate max-w-xs lg:max-w-md">{opp.title}</p>
                                                <p className="text-xs text-zinc-600 font-mono mt-0.5">{opp.community}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <ScoreBadge score={opp.score} />
                                            </td>
                                            <td className="px-4 py-3 text-xs text-zinc-600 font-mono">
                                                {opp.community}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    size="sm"
                                                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-md h-7 px-3 font-medium"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveOpp(opp);
                                                    }}
                                                >
                                                    Generate Reply
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Drawer - slides in, does NOT overlay table */}
            {activeOpp && (
                <ReplyDrawer
                    opportunity={activeOpp}
                    onClose={() => setActiveOpp(null)}
                />
            )}
        </div>
    );
}
